import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("recovered pre-fill radio label leaves its order optional", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 44000, [
    "take_lantern",
    "enter_house",
    "read_log",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "study_tide_chart",
  ]);
  const view = replayed.observation;
  const radioIndex = view.actions.findIndex(([id]) => id === "check_storm_radio");
  const input = modelTurnInput(world, view);

  assert.notEqual(radioIndex, -1);
  assert.equal(view.actions[radioIndex][1], "Check the storm radio (optional; costs one turn)");
  assert.doesNotMatch(view.actions[radioIndex][1], /before taking oil/i);
  assert.equal(input.a[radioIndex][1], "Optional: check the storm radio (costs one turn)");
});
