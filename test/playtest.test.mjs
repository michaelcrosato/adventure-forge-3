import assert from "node:assert/strict";
import test from "node:test";
import { runSession } from "../src/playtest.mjs";

test("scripted play completes directly without a server", async () => {
  const result = await runSession({ playerSpec: "scripted", seed: 5 });
  assert.equal(result.outcome, "beacon");
  assert.equal(result.traceVerified, true);
  assert.equal(result.failure, null);
  assert.equal(result.usage.requests, 0);
});

test("random direct play is repeatable for a seed", async () => {
  const first = await runSession({ playerSpec: "random", seed: 44 });
  const second = await runSession({ playerSpec: "random", seed: 44 });
  assert.deepEqual(first.actions, second.actions);
  assert.equal(first.outcome, second.outcome);
});

test("a custom provider module receives only the compact player interface", async () => {
  const result = await runSession({
    playerSpec: "module:fixtures/fake-player.mjs",
    seed: 2,
    model: "fixture-v1",
  });
  assert.equal(result.outcome, "beacon");
  assert.equal(result.player.isolation, "test_fixture");
  assert.deepEqual(result.ratings, { fun: 4, clarity: 5 });
});
