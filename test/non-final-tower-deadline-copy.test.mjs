import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("non-final tower input does not claim that this is the last turn", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 42, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.room, "tower");
  assert.ok(state.turn < world.maxTurns - 1);
  assert.match(view.text, /before the final turn: finish the remaining preparation/i);
  assert.doesNotMatch(view.text, /last turn: light now/i);
  assert.doesNotMatch(input.text, /last turn: light now/i);
});

test("confirmed-channel tower input drops a shutter action that is no longer legal", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 43, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
    "check_tower_radio",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.equal(replayed.state.room, "tower");
  assert.equal(replayed.observation.actions.some(([id]) => id === "close_storm_shutters"), false);
  assert.match(replayed.observation.event, /bar storm shutters before this check/i);
  assert.doesNotMatch(input.last, /bar storm shutters before this check/i);
});
