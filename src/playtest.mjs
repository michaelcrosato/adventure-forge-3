#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { aggregateRecords } from "./aggregate.mjs";
import { projectBuildHash, PROJECT_ROOT } from "./build-hash.mjs";
import {
  createState,
  loadWorld,
  modelTurnInput,
  observation,
  replayActions,
  sha256,
  stableStringify,
  step,
} from "./engine.mjs";
import { createPlayer } from "./players.mjs";

const DEFAULT_STORE = resolve(PROJECT_ROOT, "artifacts/runs");

function emptyUsage() {
  return { requests: 0, input: 0, output: 0, total: 0, cached: 0 };
}

function addUsage(target, usage) {
  if (!usage) return;
  target.requests += 1;
  for (const key of ["input", "output", "total", "cached"]) {
    target[key] += Number(usage[key]) || 0;
  }
}

function directFindings({ playerSpec, outcome, turns, maxTurns, failure }) {
  const findings = [];
  if (failure?.kind === "engine") {
    findings.push({
      key: "direct-engine-failure",
      title: "Direct engine play failed",
      severity: 3,
      evidence: failure.message,
      turn: turns,
    });
  }
  if (failure?.kind === "replay") {
    findings.push({
      key: "trace-replay-mismatch",
      title: "Recorded action trace did not replay",
      severity: 3,
      evidence: failure.message,
      turn: turns,
    });
  }
  if (!failure && playerSpec === "scripted" && outcome !== "beacon") {
    findings.push({
      key: "scripted-route-broken",
      title: "Known winning route did not reach the beacon",
      severity: 3,
      evidence: `The scripted route ended as ${outcome ?? "incomplete"} after ${turns}/${maxTurns} turns.`,
      turn: turns,
    });
  }
  return findings;
}

function sanitizeReview(review) {
  if (!review) return { ratings: null, replayIntent: null, summary: null, findings: [] };
  const ratings = review.ratings ?? {};
  if (
    !Number.isSafeInteger(ratings.fun) ||
    ratings.fun < 1 ||
    ratings.fun > 5 ||
    !Number.isSafeInteger(ratings.clarity) ||
    ratings.clarity < 1 ||
    ratings.clarity > 5
  ) {
    throw new Error("Player review ratings must be integers from 1 to 5.");
  }
  const findings = Array.isArray(review.findings) ? review.findings : [];
  if (findings.length > 3) throw new Error("Player review may contain at most three findings.");
  return {
    ratings: { fun: ratings.fun, clarity: ratings.clarity },
    replayIntent: ["yes", "maybe", "no"].includes(review.replayIntent)
      ? review.replayIntent
      : null,
    summary: review.summary ? String(review.summary).slice(0, 160) : null,
    findings: findings.map((finding, index) => ({
      key: String(finding.key ?? `finding-${index + 1}`).slice(0, 80),
      title: String(finding.title ?? `Finding ${index + 1}`).slice(0, 120),
      severity: Math.max(1, Math.min(3, Number(finding.severity) || 1)),
      evidence: String(finding.evidence ?? "").slice(0, 280),
      turn: Math.max(0, Number(finding.turn) || 0),
    })),
  };
}

export async function runSession({
  playerSpec = "random",
  seed = 1,
  worldPath,
  model,
} = {}) {
  const world = await loadWorld(worldPath);
  const player = await createPlayer(playerSpec, { world, seed, model });
  const usage = emptyUsage();
  let state = createState(world, seed);
  let lastEvent = null;
  let view = observation(world, state);
  const actions = [];
  const frames = [[0, view.at[0], view.at[1], "START", view.text]];
  const inputBytes = [];
  let failure = null;
  let reviewResult = null;
  let traceVerified = false;

  try {
    while (!state.ended && state.turn < world.maxTurns) {
      const actionRows = view.actions ?? [];
      if (actionRows.length === 0) {
        failure = { kind: "engine", message: `No legal action at turn ${state.turn}.` };
        break;
      }
      const turnInput = modelTurnInput(world, view);
      inputBytes.push(Buffer.byteLength(JSON.stringify(turnInput)));

      let decision;
      try {
        decision = await player.choose({
          turnInput,
          actionIds: actionRows.map(([id]) => id),
        });
      } catch (error) {
        failure = { kind: "player", message: String(error?.message ?? error).slice(0, 800) };
        break;
      }
      addUsage(usage, decision?.usage);
      if (!Number.isSafeInteger(decision?.index) || decision.index < 0 || decision.index >= actionRows.length) {
        failure = {
          kind: "player",
          message: `Player returned invalid action index ${JSON.stringify(decision?.index)} at turn ${state.turn}.`,
        };
        break;
      }

      const [actionId, actionLabel] = actionRows[decision.index];
      const result = step(world, state, actionId);
      if (!result.ok) {
        failure = { kind: "engine", message: result.error };
        break;
      }
      actions.push(actionId);
      state = result.state;
      lastEvent = result.event;
      view = observation(world, state, lastEvent);
      frames.push([state.turn, view.at[0], view.at[1], actionLabel, lastEvent]);
    }

    try {
      const replayed = replayActions(world, seed, actions);
      if (stableStringify(replayed.state) !== stableStringify(state)) {
        throw new Error("Replayed state differs from the state produced during play.");
      }
      traceVerified = true;
    } catch (error) {
      failure = { kind: "replay", message: String(error?.message ?? error).slice(0, 800) };
    }

    if (player.descriptor.kind === "agent" && state.ended && failure === null) {
      const runDigest = {
        goal: world.objective,
        outcome: view.end
          ? { id: view.end[0], title: view.end[1], text: view.end[2] }
          : null,
        turns: state.turn,
        score: state.score,
        facts: state.journal,
        route: frames,
      };
      try {
        const rawReview = await player.review({ runDigest });
        addUsage(usage, rawReview?.usage);
        reviewResult = sanitizeReview(rawReview);
      } catch (error) {
        failure = { kind: "review", message: String(error?.message ?? error).slice(0, 800) };
      }
    }
  } finally {
    await player.close();
  }

  const outcome = state.ending;
  const review = reviewResult ?? {
    ratings: null,
    replayIntent: null,
    summary: null,
    findings: [],
  };
  return {
    outcome,
    turns: state.turn,
    actions,
    ratings: review.ratings,
    replayIntent: review.replayIntent,
    summary: review.summary,
    findings: [
      ...directFindings({ playerSpec, outcome, turns: state.turn, maxTurns: world.maxTurns, failure }),
      ...review.findings,
    ],
    failure,
    final: view,
    traceVerified,
    usage,
    promptBytes: {
      turns: inputBytes.length,
      total: inputBytes.reduce((sum, value) => sum + value, 0),
      mean: inputBytes.length
        ? inputBytes.reduce((sum, value) => sum + value, 0) / inputBytes.length
        : 0,
    },
    player: player.descriptor,
  };
}

function contentAddress(record) {
  return sha256(stableStringify(record));
}

export async function writeRecord(
  result,
  { store = DEFAULT_STORE, build, seed, startedAt, durationMs } = {},
) {
  const body = {
    schemaVersion: 1,
    build,
    startedAt,
    durationMs,
    seed,
    player: result.player,
    outcome: result.outcome,
    turns: result.turns,
    actions: result.actions,
    ratings: result.ratings,
    replayIntent: result.replayIntent,
    summary: result.summary,
    findings: result.findings,
    failure: result.failure,
    traceVerified: result.traceVerified === true,
    usage: result.usage,
    promptBytes: result.promptBytes,
  };
  const recordId = contentAddress(body);
  const record = { recordId, ...body };
  await mkdir(store, { recursive: true });
  await writeFile(resolve(store, `${recordId}.json`), `${JSON.stringify(record, null, 2)}\n`, {
    flag: "wx",
  }).catch((error) => {
    if (error.code !== "EEXIST") throw error;
  });
  return record;
}

async function mapConcurrent(items, concurrency, worker) {
  if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 64) {
    throw new Error("concurrency must be an integer from 1 to 64.");
  }
  const results = new Array(items.length);
  let next = 0;
  async function lane() {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane));
  return results;
}

export async function runPlaytests({
  runs = 4,
  player = "mix",
  concurrency = 4,
  seedBase = 1,
  store = DEFAULT_STORE,
  model,
  worldPath,
  aggregate = true,
} = {}) {
  if (!Number.isSafeInteger(runs) || runs < 1 || runs > 1000) {
    throw new Error("runs must be an integer from 1 to 1000.");
  }
  if (!Number.isSafeInteger(seedBase)) throw new Error("seedBase must be a safe integer.");
  const selectedWorldPath = worldPath ?? process.env.DIRECT_WORLD;
  const build = await projectBuildHash(PROJECT_ROOT, selectedWorldPath);
  const jobs = Array.from({ length: runs }, (_, index) => ({ seed: seedBase + index, index }));
  const records = await mapConcurrent(jobs, concurrency, async ({ seed, index }) => {
    const selected =
      player === "mix"
        ? index === 0
          ? "scripted"
          : index % 2
            ? "explorer"
            : "random"
        : player;
    const startedAt = new Date().toISOString();
    const start = performance.now();
    const result = await runSession({ playerSpec: selected, seed, worldPath, model });
    return writeRecord(result, {
      store,
      build,
      seed,
      startedAt,
      durationMs: Math.round(performance.now() - start),
    });
  });
  const summary = aggregate
    ? await aggregateRecords({ store, build, worldPath: selectedWorldPath })
    : null;
  return { build, records, summary, worldPath: selectedWorldPath };
}

function parseCli(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--runs") options.runs = Number(argv[++index]);
    else if (flag === "--player") options.player = argv[++index];
    else if (flag === "--concurrency") options.concurrency = Number(argv[++index]);
    else if (flag === "--seed") options.seedBase = Number(argv[++index]);
    else if (flag === "--store") options.store = resolve(argv[++index]);
    else if (flag === "--model") options.model = argv[++index];
    else if (flag === "--world") options.worldPath = resolve(argv[++index]);
    else if (flag === "--no-aggregate") options.aggregate = false;
    else throw new Error(`Unknown argument: ${flag}`);
  }
  return options;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runPlaytests(parseCli(process.argv.slice(2)))
    .then(({ build, records, summary }) => {
      process.stdout.write(
        `${JSON.stringify({
          build,
          records: records.length,
          outcomes: summary?.outcomes ?? null,
          top: summary?.top ?? null,
          usage: summary?.usage ?? null,
        })}\n`,
      );
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
