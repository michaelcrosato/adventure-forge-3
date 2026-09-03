import assert from "node:assert/strict";
import test from "node:test";
import { runSession } from "../src/playtest.mjs";

test("the tide window includes the secured-boat signal", async () => {
  const result = await runSession({ playerSpec: "explorer", seed: 23 });

  assert.equal(result.outcome, "beacon");
  assert.equal(result.failure, null);
  assert.equal(result.actions.includes("secure_mooring"), true);
  assert.equal(result.actions.includes("signal_boat"), true);
});
