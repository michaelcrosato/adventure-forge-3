import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the final beacon model input leaves the generic deadline in its deadline field", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 5, [
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
  assert.match(input.text, /one beacon finish remains; light now/i);
  assert.doesNotMatch(input.text, /Last turn: light now/i);
  assert.match(input.deadline, /last turn: light now/i);
});
