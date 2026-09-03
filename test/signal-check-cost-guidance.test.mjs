import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback states the storm-radio check cost before commitment", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 4091, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;

  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.match(signaled.event, /check it before taking oil \(costs one turn\)/i);
});
