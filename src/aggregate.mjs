#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectBuildHash, PROJECT_ROOT } from "./build-hash.mjs";
import { loadWorld, replayActions, sha256, stableStringify } from "./engine.mjs";

const DEFAULT_STORE = resolve(PROJECT_ROOT, "artifacts/runs");
const DEFAULT_SUMMARY = resolve(PROJECT_ROOT, "artifacts/summary.json");
const DEFAULT_TASK = resolve(PROJECT_ROOT, "NEXT_TASK.md");

function severityNumber(value) {
  if (Number.isInteger(value)) return Math.max(1, Math.min(3, value));
  return { low: 1, medium: 2, high: 3, critical: 3 }[String(value).toLowerCase()] ?? 1;
}

function findingKey(value) {
  return (
    String(value ?? "unspecified")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "unspecified"
  );
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function sum(records, selector) {
  return records.reduce((total, record) => total + (Number(selector(record)) || 0), 0);
}

function verifyRecordIdentity(record, name) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("record must be an object");
  }
  const { recordId, ...body } = record;
  if (typeof recordId !== "string" || !/^[0-9a-f]{64}$/.test(recordId)) {
    throw new Error("recordId must be a SHA-256 hex digest");
  }
  if (name.slice(0, -5) !== recordId) {
    throw new Error("filename does not match recordId");
  }
  if (sha256(stableStringify(body)) !== recordId) {
    throw new Error("recordId does not match record contents");
  }
}

function verifyTrace(record, world) {
  if (record.traceVerified !== true) return;
  if (!Number.isSafeInteger(record.seed) || !Array.isArray(record.actions)) {
    throw new Error("verified record requires a safe-integer seed and action trace");
  }
  let replayed;
  try {
    replayed = replayActions(world, record.seed, record.actions);
  } catch (error) {
    throw new Error(`action trace is not replayable: ${error.message}`);
  }
  if (
    record.turns !== replayed.state.turn ||
    record.outcome !== replayed.state.ending
  ) {
    throw new Error("record outcome does not match replayed state");
  }
}

export async function readRecords(store = DEFAULT_STORE) {
  let names = [];
  try {
    names = (await readdir(store)).filter((name) => name.endsWith(".json")).sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const records = [];
  for (const name of names) {
    try {
      const record = JSON.parse(await readFile(resolve(store, name), "utf8"));
      verifyRecordIdentity(record, name);
      records.push(record);
    } catch (error) {
      throw new Error(`Invalid playtest record ${name}: ${error.message}`);
    }
  }
  return records;
}

export function summarize(records, build) {
  const current = records.filter((record) => record.build === build && record.traceVerified === true);
  const completed = current.filter((record) => typeof record.outcome === "string");
  const wins = completed.filter((record) => record.outcome === "beacon");
  const ratingRows = current.filter(
    (record) => Number.isFinite(record.ratings?.fun) && Number.isFinite(record.ratings?.clarity),
  );

  const clusters = new Map();
  for (const record of current) {
    for (const finding of record.findings ?? []) {
      const key = findingKey(finding.key ?? finding.title);
      const row = clusters.get(key) ?? {
        key,
        title: finding.title ?? key.replaceAll("-", " "),
        count: 0,
        maxSeverity: 1,
        lineages: new Set(),
        runs: new Set(),
        evidence: [],
        mechanical: false,
        agent: false,
      };
      row.count += 1;
      row.maxSeverity = Math.max(row.maxSeverity, severityNumber(finding.severity));
      row.lineages.add(`${record.player?.name ?? "unknown"}:${record.player?.model ?? "none"}`);
      row.runs.add(record.recordId ?? `${record.startedAt}:${record.seed}`);
      if (
        typeof finding.evidence === "string" &&
        row.evidence.length < 3 &&
        !row.evidence.includes(finding.evidence)
      ) {
        row.evidence.push(finding.evidence.slice(0, 280));
      }
      row.mechanical ||= record.player?.kind === "mechanical";
      row.agent ||= record.player?.kind === "agent";
      clusters.set(key, row);
    }
  }

  const ranked = [...clusters.values()]
    .map((row) => {
      const independentRuns = row.runs.size;
      const independentLineages = row.lineages.size;
      const promoted =
        row.mechanical ||
        row.maxSeverity >= 3 ||
        (row.maxSeverity >= 2 && independentRuns >= 2) ||
        independentRuns >= 3;
      const score =
        row.maxSeverity * 10 +
        independentRuns * 3 +
        independentLineages * 4 +
        row.count +
        (row.mechanical ? 8 : 0);
      return {
        key: row.key,
        title: row.title,
        count: row.count,
        independentRuns,
        independentLineages,
        severity: row.maxSeverity,
        promoted,
        score,
        evidence: row.evidence,
        sources: [row.mechanical ? "mechanical" : null, row.agent ? "agent" : null].filter(Boolean),
      };
    })
    .sort((a, b) => b.score - a.score || a.key.localeCompare(b.key));

  const top = ranked.find((row) => row.promoted) ?? null;
  const outcomes = [...new Set(current.map((record) => record.outcome ?? "incomplete"))].sort();
  return {
    schemaVersion: 1,
    build,
    records: current.length,
    outcomes: Object.fromEntries(
      outcomes.map((outcome) => [
        outcome,
        current.filter((record) => (record.outcome ?? "incomplete") === outcome).length,
      ]),
    ),
    completionRate: completed.length ? wins.length / completed.length : null,
    meanTurns: average(current.map((record) => record.turns).filter(Number.isFinite)),
    ratings: {
      count: ratingRows.length,
      fun: average(ratingRows.map((record) => record.ratings.fun)),
      clarity: average(ratingRows.map((record) => record.ratings.clarity)),
    },
    failures: current.filter((record) => record.failure).length,
    usage: {
      requests: sum(current, (record) => record.usage?.requests),
      inputTokens: sum(current, (record) => record.usage?.input),
      outputTokens: sum(current, (record) => record.usage?.output),
      totalTokens: sum(current, (record) => record.usage?.total),
      cachedInputTokens: sum(current, (record) => record.usage?.cached),
    },
    promptBytes: {
      total: sum(current, (record) => record.promptBytes?.total),
      meanPerTurn: average(
        current.flatMap((record) => {
          const turns = Number(record.promptBytes?.turns) || 0;
          return turns ? [record.promptBytes.total / turns] : [];
        }),
      ),
    },
    top,
    clusters: ranked,
  };
}

export function taskMarkdown(summary) {
  if (!summary.top) {
    return [
      "# Next task",
      "",
      "No finding has enough evidence to promote.",
      "",
      "Collect more direct AI playtests. Do not invent a code change from empty evidence.",
      "",
    ].join("\n");
  }
  const top = summary.top;
  return [
    "# Next task",
    "",
    `Fix one issue: **${top.title}**.`,
    "",
    `Evidence: ${top.count} report(s), ${top.independentRuns} run(s), ${top.independentLineages} lineage(s), severity ${top.severity}.`,
    ...top.evidence.slice(0, 3).map((item) => `- ${item}`),
    "",
    "## Acceptance",
    "",
    "- Change only `game/world.json` or `src/engine.mjs`.",
    "- Add a new focused test. Do not edit an existing test.",
    "- Keep the playtest supervisor in process. Do not add a server or tool protocol.",
    "- Keep player action output to one structured action index.",
    "- Keep the engine authoritative for state, legality, outcomes, and replay.",
    "- Run `npm test`.",
    "- Run `npm run playtest:smoke`.",
    "",
  ].join("\n");
}

export async function aggregateRecords({
  store = DEFAULT_STORE,
  outputPath = DEFAULT_SUMMARY,
  taskPath = DEFAULT_TASK,
  build,
  worldPath,
} = {}) {
  const selectedBuild = build ?? (await projectBuildHash(PROJECT_ROOT, worldPath));
  const records = await readRecords(store);
  const current = records.filter((record) => record.build === selectedBuild);
  const world = current.some((record) => record.traceVerified === true)
    ? await loadWorld(worldPath ?? resolve(PROJECT_ROOT, "game/world.json"))
    : null;
  for (const record of current) verifyTrace(record, world);
  const summary = summarize(records, selectedBuild);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
  await writeFile(taskPath, taskMarkdown(summary));
  return summary;
}

function parseCli(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--store") options.store = resolve(argv[++index]);
    else if (flag === "--out") options.outputPath = resolve(argv[++index]);
    else if (flag === "--task") options.taskPath = resolve(argv[++index]);
    else if (flag === "--world") options.worldPath = resolve(argv[++index]);
    else throw new Error(`Unknown argument: ${flag}`);
  }
  return options;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  aggregateRecords(parseCli(process.argv.slice(2)))
    .then((summary) => process.stdout.write(`${JSON.stringify(summary)}\n`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
