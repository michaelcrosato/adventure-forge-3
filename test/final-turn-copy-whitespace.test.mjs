import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("final-turn tower guidance does not add duplicate spaces", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 107, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "trim_wick",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /wick trimmed; remaining lens alignment is too late/i);
  assert.doesNotMatch(view.text, / {2,}/);
  assert.doesNotMatch(input.text, / {2,}/);
});
