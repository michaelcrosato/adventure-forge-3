import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("radio-confirmed tower input names preparation before a finish is available", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 1, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
    "climb_tower",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.room, "tower");
  assert.equal(legalActions(world, state).some((id) => id.startsWith("light_")), false);
  assert.match(view.text, /several lighting choices/i);
  assert.match(input.text, /no beacon finish is available yet; most preparation: confirmed-channel rescue/i);
  assert.doesNotMatch(input.text, /several lighting choices/i);
  assert.doesNotMatch(input.text, /sheltered confirmed-channel rescue/i);
});
