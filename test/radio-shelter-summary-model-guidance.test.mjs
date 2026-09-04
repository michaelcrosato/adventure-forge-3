import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("bounded tower summary drops the closed sheltered radio finish", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 9304, [
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

  assert.match(view.text, /sheltered confirmed-channel rescue/i);
  assert.match(input.text, /most preparation: confirmed-channel rescue/i);
  assert.doesNotMatch(input.text, /sheltered confirmed-channel rescue/i);
});
