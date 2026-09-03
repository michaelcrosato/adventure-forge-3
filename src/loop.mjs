#!/usr/bin/env node
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { aggregateRecords } from "./aggregate.mjs";
import { PRODUCT_FILES, projectBuildHash, PROJECT_ROOT } from "./build-hash.mjs";
import { runPlaytests, runSession } from "./playtest.mjs";

const PRODUCT_SET = new Set(PRODUCT_FILES);
const SKIP_DIRS = new Set([".git", "node_modules"]);

function runCommand(command, { input, timeoutMs = 2_400_000, quiet = false } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, {
      cwd: PROJECT_ROOT,
      shell: true,
      env: process.env,
      stdio: ["pipe", quiet ? "pipe" : "inherit", quiet ? "pipe" : "inherit"],
    });
    let stderr = "";
    let timedOut = false;
    let finished = false;
    if (quiet) {
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk) => {
        stderr = (stderr + chunk).slice(-8_000);
      });
    }
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, timeoutMs);
    const finish = (error = null) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolvePromise();
    };
    child.on("error", (error) => {
      finish(error);
    });
    child.on("exit", (code, signal) => {
      if (timedOut) {
        finish(new Error(`Command timed out after ${timeoutMs} ms: ${command}`));
      } else if (code === 0) {
        finish();
      } else {
        finish(
          new Error(`Command failed (code=${code}, signal=${signal}): ${command}\n${stderr}`),
        );
      }
    });
    child.stdin.end(input ?? "");
  });
}

async function listProjectFiles(directory = PROJECT_ROOT) {
  const output = [];
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
      const target = resolve(path, entry.name);
      if (entry.isDirectory()) await walk(target);
      else if (entry.isFile()) output.push(relative(PROJECT_ROOT, target).replaceAll("\\", "/"));
    }
  }
  await walk(directory);
  return output.sort();
}

async function fileDigest(relativePath) {
  return createHash("sha256")
    .update(await readFile(resolve(PROJECT_ROOT, relativePath)))
    .digest("hex");
}

async function snapshotProtectedTree() {
  const snapshot = new Map();
  for (const path of await listProjectFiles()) {
    if (PRODUCT_SET.has(path)) continue;
    snapshot.set(path, await fileDigest(path));
  }
  return snapshot;
}

async function assertProtectedTree(snapshot) {
  for (const [path, expected] of snapshot) {
    let actual;
    try {
      actual = await fileDigest(path);
    } catch {
      throw new Error(`Coding agent removed protected file ${path}.`);
    }
    if (actual !== expected) throw new Error(`Coding agent changed protected file ${path}.`);
  }
  for (const path of await listProjectFiles()) {
    if (snapshot.has(path) || PRODUCT_SET.has(path)) continue;
    if (!path.startsWith("test/")) {
      throw new Error(`Coding agent created disallowed file ${path}.`);
    }
  }
}

function coderPrompt(task) {
  return [
    "You are the coding agent for Direct Game Loop.",
    "Make one small change that addresses the evidence-backed task below.",
    "You may edit only game/world.json and src/engine.mjs.",
    "You may add one new focused test under test/. Do not edit any existing test.",
    "Keep the engine deterministic and data-driven.",
    "Keep automated playtests in process. Do not add MCP, an HTTP game server, or a tool protocol.",
    "Player action output must stay one structured action index: {\"a\":N}.",
    "Do not read or edit artifacts/ or NEXT_TASK.md.",
    "Run npm test before completion. Exit nonzero when the result is not green.",
    "",
    task.trim(),
    "",
  ].join("\n");
}

export async function runCycle({
  runs = 4,
  player = "mix",
  concurrency = 2,
  seedBase = 1,
  model,
  worldPath,
  coderCommand = process.env.AI_CODER_CMD,
} = {}) {
  process.stdout.write("[gate] npm test\n");
  await runCommand("npm test");

  process.stdout.write(`[playtest] direct player=${player} runs=${runs}\n`);
  const wave = await runPlaytests({
    runs,
    player,
    concurrency,
    seedBase,
    model,
    worldPath,
    aggregate: false,
  });
  const summary = await aggregateRecords({ build: wave.build, worldPath: wave.worldPath });

  if (!summary.top) {
    process.stdout.write("[stop] no promoted finding; collect more evidence\n");
    return { status: "no-finding", summary };
  }
  if (!coderCommand) {
    process.stdout.write("[stop] NEXT_TASK.md is ready; set AI_CODER_CMD to apply it\n");
    return { status: "task-ready", summary };
  }

  const task = await readFile(resolve(PROJECT_ROOT, "NEXT_TASK.md"), "utf8");
  const protectedTree = await snapshotProtectedTree();
  const beforeBuild = wave.build;

  process.stdout.write(`[code] ${summary.top.key}\n`);
  let coderError = null;
  try {
    await runCommand(coderCommand, { input: coderPrompt(task) });
  } catch (error) {
    coderError = error;
  }
  let protectedTreeError = null;
  try {
    await assertProtectedTree(protectedTree);
  } catch (error) {
    protectedTreeError = error;
  }
  if (coderError) {
    if (protectedTreeError) {
      throw new Error(`${coderError.message}\n${protectedTreeError.message}`);
    }
    throw coderError;
  }
  if (protectedTreeError) throw protectedTreeError;

  const changedBuild = await projectBuildHash(PROJECT_ROOT, wave.worldPath);
  if (changedBuild === beforeBuild) {
    throw new Error("Coding agent exited successfully but made no game-build change.");
  }

  process.stdout.write("[gate] npm test\n");
  await runCommand("npm test");
  await assertProtectedTree(protectedTree);
  if ((await projectBuildHash(PROJECT_ROOT, wave.worldPath)) !== changedBuild) {
    throw new Error("Game build changed while post-change tests ran.");
  }
  process.stdout.write("[gate] scripted direct playthrough\n");
  const smoke = await runSession({ playerSpec: "scripted", seed: seedBase, worldPath: wave.worldPath });
  if (smoke.outcome !== "beacon" || smoke.traceVerified !== true || smoke.failure !== null) {
    throw new Error("Post-change scripted direct playthrough did not reach the verified beacon ending.");
  }
  await assertProtectedTree(protectedTree);
  if ((await projectBuildHash(PROJECT_ROOT, wave.worldPath)) !== changedBuild) {
    throw new Error("Game build changed while the scripted gate ran.");
  }
  return { status: "changed", summary, beforeBuild, changedBuild, smoke };
}

function parseCli(argv) {
  const options = { cycles: 1 };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--cycles") options.cycles = Number(argv[++index]);
    else if (flag === "--runs") options.runs = Number(argv[++index]);
    else if (flag === "--player") options.player = argv[++index];
    else if (flag === "--concurrency") options.concurrency = Number(argv[++index]);
    else if (flag === "--seed") options.seedBase = Number(argv[++index]);
    else if (flag === "--model") options.model = argv[++index];
    else if (flag === "--world") options.worldPath = resolve(argv[++index]);
    else if (flag === "--coder-cmd") options.coderCommand = argv[++index];
    else throw new Error(`Unknown argument: ${flag}`);
  }
  if (!Number.isSafeInteger(options.cycles) || options.cycles < 1 || options.cycles > 100) {
    throw new Error("cycles must be an integer from 1 to 100.");
  }
  return options;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const options = parseCli(process.argv.slice(2));
  (async () => {
    const results = [];
    for (let cycle = 0; cycle < options.cycles; cycle += 1) {
      process.stdout.write(`\n=== cycle ${cycle + 1}/${options.cycles} ===\n`);
      results.push(
        await runCycle({
          ...options,
          seedBase: (options.seedBase ?? 1) + cycle * 1_000,
        }),
      );
      if (results.at(-1).status !== "changed") break;
    }
    process.stdout.write(
      `${JSON.stringify({ cycles: results.length, status: results.at(-1)?.status })}\n`,
    );
  })().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
