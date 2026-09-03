import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback locates the storm-radio choice after the tide chart", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 4071, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;

  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.match(signaled.event, /the check choice appears after the tide chart/i);
});
