import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import { aggregateRecords, readRecords } from "../src/aggregate.mjs";
import { projectBuildHash, PROJECT_ROOT } from "../src/build-hash.mjs";
import { runSession, writeRecord } from "../src/playtest.mjs";
import { sha256, stableStringify } from "../src/engine.mjs";

const execFile = promisify(execFileCallback);

async function temporaryDirectory(t, prefix) {
  const directory = await mkdtemp(join(tmpdir(), prefix));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

async function storedScriptedRun(store) {
  const result = await runSession({ playerSpec: "scripted", seed: 1 });
  return writeRecord(result, {
    store,
    build: await projectBuildHash(),
    seed: 1,
    startedAt: "2026-09-01T00:00:00.000Z",
    durationMs: 1,
  });
}

test("content-addressed records reject modified contents", async (t) => {
  const store = await temporaryDirectory(t, "direct-loop-record-");
  const record = await storedScriptedRun(store);
  const path = join(store, `${record.recordId}.json`);
  await writeFile(path, `${JSON.stringify({ ...record, outcome: "left" })}\n`);

  await assert.rejects(readRecords(store), /recordId does not match record contents/);
});

test("aggregation rejects a trace whose claimed outcome does not replay", async (t) => {
  const store = await temporaryDirectory(t, "direct-loop-replay-");
  const outputPath = join(store, "summary.json");
  const taskPath = join(store, "NEXT_TASK.md");
  const record = await storedScriptedRun(store);
  const { recordId: ignored, ...body } = record;
  const forgedBody = { ...body, actions: ["leave_island"] };
  const forgedId = sha256(stableStringify(forgedBody));
  await rm(join(store, `${record.recordId}.json`));
  await writeFile(
    join(store, `${forgedId}.json`),
    `${JSON.stringify({ recordId: forgedId, ...forgedBody })}\n`,
  );

  await assert.rejects(
    aggregateRecords({ build: record.build, store, outputPath, taskPath }),
    /record outcome does not match replayed state/,
  );
});

test("custom world content receives a distinct build hash", async (t) => {
  const directory = await temporaryDirectory(t, "direct-loop-world-");
  const source = JSON.parse(
    await readFile(resolve(PROJECT_ROOT, "game/world.json"), "utf8"),
  );
  source.title = `${source.title} (alternate)`;
  const customPath = join(directory, "world.json");
  await writeFile(customPath, `${JSON.stringify(source)}\n`);

  assert.notEqual(
    await projectBuildHash(),
    await projectBuildHash(PROJECT_ROOT, customPath),
  );
});

test("the measure CLI emits its JSON result when launched directly", async () => {
  const { stdout, stderr } = await execFile(
    process.execPath,
    [resolve(PROJECT_ROOT, "src/measure.mjs")],
    { cwd: PROJECT_ROOT },
  );
  assert.equal(stderr, "");
  assert.equal(JSON.parse(stdout).outcome, "beacon");
});
