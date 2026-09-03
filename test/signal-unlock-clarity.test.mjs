import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback explains what unlocking the storm radio means", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 3661, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.match(signaled.event, /unlock the storm radio: make the storm radio available/i);
});
