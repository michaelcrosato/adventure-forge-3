import assert from "node:assert/strict";
import test from "node:test";
import { runSession } from "../src/playtest.mjs";

test("the expanded tide window gives a repaired exploratory route time to light", async () => {
  const result = await runSession({ playerSpec: "explorer", seed: 41 });

  assert.equal(result.outcome, "beacon");
  assert.equal(result.failure, null);
  assert.ok(result.turns <= 18);
});
