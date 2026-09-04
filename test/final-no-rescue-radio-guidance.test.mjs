import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the final no-rescue model input does not offer a late tower radio check", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 2, [
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
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "trim_wick",
    "align_lens",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.turn, world.maxTurns - 1);
  assert.deepEqual(view.actions, [["leave_island", world.actions.leave_island.label]]);
  assert.match(view.text, /tower relay can confirm the radio channel after the lantern is filled/i);
  assert.match(input.text, /radio checks are too late/i);
  assert.doesNotMatch(input.text, /tower relay can confirm the radio channel after the lantern is filled/i);
});
