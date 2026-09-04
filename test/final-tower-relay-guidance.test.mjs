import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("final-turn tower guidance drops the deadline-closed relay", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 24109, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
    "close_storm_shutters",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.turn, world.maxTurns - 1);
  assert.equal(legalActions(world, state).includes("check_tower_radio"), false);
  assert.match(view.text, /confirmed-channel route is unavailable/i);
  assert.match(input.text, /confirmed-channel route is unavailable/i);
  assert.doesNotMatch(input.text, /tower relay can confirm/i);
});
