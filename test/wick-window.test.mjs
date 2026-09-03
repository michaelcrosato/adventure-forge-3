import assert from "node:assert/strict";
import test from "node:test";
import { runSession } from "../src/playtest.mjs";

test("the tide window includes the optional trim-and-align finish", async () => {
  const result = await runSession({ playerSpec: "explorer", seed: 58 });

  assert.equal(result.outcome, "beacon");
  assert.equal(result.failure, null);
  assert.equal(result.turns, 19);
  assert.equal(result.actions.at(-3), "trim_wick");
  assert.equal(result.actions.at(-2), "align_lens");
  assert.equal(result.actions.at(-1), "light_aligned_trimmed_beacon");
});
