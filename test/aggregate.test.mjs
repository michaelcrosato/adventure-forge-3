import assert from "node:assert/strict";
import test from "node:test";
import { summarize, taskMarkdown } from "../src/aggregate.mjs";

const BUILD = "a".repeat(64);
function modelRecord(seed, severity = 2) {
  return {
    recordId: `run-${seed}`,
    build: BUILD,
    startedAt: `2026-01-01T00:00:0${seed}Z`,
    seed,
    traceVerified: true,
    player: { kind: "agent", name: "fixture-agent", model: "small" },
    outcome: "beacon",
    turns: 10,
    ratings: { fun: 4, clarity: 3 },
    findings: [
      {
        key: "unclear-fuse-feedback",
        title: "Fuse feedback is unclear",
        severity,
        evidence: `Evidence ${seed}`,
      },
    ],
    usage: { requests: 11, input: 100, output: 20, total: 120, cached: 0 },
    promptBytes: { turns: 10, total: 2000 },
  };
}

test("one material subjective report accumulates without creating a task", () => {
  const summary = summarize([modelRecord(1)], BUILD);
  assert.equal(summary.top, null);
  assert.match(taskMarkdown(summary), /No finding/);
});

test("two independent material reports create one concise task", () => {
  const summary = summarize([modelRecord(1), modelRecord(2)], BUILD);
  assert.equal(summary.top.key, "unclear-fuse-feedback");
  const task = taskMarkdown(summary);
  assert.match(task, /Fix one issue/);
  assert.equal((task.match(/^- Evidence/gm) ?? []).length, 2);
});

test("a replay-verified mechanical failure promotes immediately", () => {
  const record = {
    ...modelRecord(1),
    player: { kind: "mechanical", name: "scripted", model: null },
    findings: [
      {
        key: "scripted-route-broken",
        title: "Known route broke",
        severity: 3,
        evidence: "Beacon was not reached.",
      },
    ],
  };
  assert.equal(summarize([record], BUILD).top.key, "scripted-route-broken");
});
