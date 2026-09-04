import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the final non-tower model input stops giving unavailable route instructions", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 105003, [
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
    "go_jetty",
    "take_lantern",
    "enter_house",
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
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.room, "workshop");
  assert.equal(state.turn, world.maxTurns - 1);
  assert.deepEqual(view.actions, [["leave_island", world.actions.leave_island.label]]);
  assert.match(input.text, /no rescue remains; leave if possible/i);
  assert.doesNotMatch(input.text, /climb the service ladder|return only for missing supplies/i);
});
