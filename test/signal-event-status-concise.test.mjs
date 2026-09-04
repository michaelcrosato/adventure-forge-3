import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions, step } from "../src/engine.mjs";

test("post-signal feedback does not repeat the recorded boat status", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 100006, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;

  const signaled = step(world, keeper, "signal_boat");
  const input = modelTurnInput(world, replayActions(world, 100006, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
  ]).observation);

  assert.equal(signaled.ok, true, signaled.error);
  assert.doesNotMatch(signaled.event, /^Boat holds\./i);
  assert.match(signaled.event, /study the tide chart now to unlock the storm radio/i);
  assert.equal(input.last, "Boat holds. Study the tide chart to unlock the storm radio.");
});
