import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback marks the tower relay as an optional fallback", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 625020, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.match(signaled.event, /Optional: tower relay later if you skip the check/i);
});
