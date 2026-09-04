import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the final no-rescue shutter model input does not suggest more preparation", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 2, [
    "enter_house",
    "read_log",
    "study_tide_chart",
    "go_jetty",
    "take_lantern",
    "enter_house",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
    "wait_for_horn",
    "close_storm_shutters",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.turn, world.maxTurns - 1);
  assert.match(view.text, /several lighting choices/i);
  assert.match(input.text, /no beacon finish remains/i);
  assert.doesNotMatch(input.text, /lighting choices|complete the available preparation before lighting|most preparation/i);
});
