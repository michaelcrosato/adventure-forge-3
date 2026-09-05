import assert from "node:assert/strict";
import test from "node:test";
import {
  loadWorld,
  modelTurnInput,
  observation,
  replayActions,
  step,
} from "../src/engine.mjs";

test("recovered signal label leaves radio timing optional", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 5008, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");
  const view = observation(world, signaled.state, signaled.event);
  const input = modelTurnInput(world, view);
  const radioIndex = view.actions.findIndex(([id]) => id === "check_storm_radio");

  assert.equal(signaled.ok, true, signaled.error);
  assert.notEqual(radioIndex, -1);
  assert.equal(input.a[radioIndex][1], "Optional: check the storm radio (costs one turn)");
  assert.doesNotMatch(input.a[radioIndex][1], /before taking oil/i);
});
