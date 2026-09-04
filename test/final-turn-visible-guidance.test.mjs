import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the final-turn tower copy only advertises the visible beacon finish", async () => {
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

  assert.equal(state.turn, world.maxTurns - 1);
  assert.deepEqual(view.actions, [["light_trimmed_beacon", world.actions.light_trimmed_beacon.label]]);
  assert.match(view.text, /wick trimmed; remaining lens alignment is too late/i);
  assert.match(view.text, /one beacon finish remains; light now/i);
  assert.doesNotMatch(view.text, /align the beacon lens before lighting if desired/i);
  assert.doesNotMatch(view.text, /several lighting choices/i);
  assert.match(input.text, /one beacon finish remains; light now/i);
});
