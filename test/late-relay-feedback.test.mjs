import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("late relay feedback stops repeating completed beam preparation", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 100011, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
    "close_storm_shutters",
  ]).state;

  const checked = step(world, tower, "check_tower_radio");
  const input = modelTurnInput(world, observation(world, checked.state, checked.event));

  assert.equal(tower.turn, world.maxTurns - 5);
  assert.equal(checked.ok, true, checked.error);
  assert.equal(checked.event, "Channel is clear; the sheltered confirmed-channel finish is ready.");
  assert.equal(input.last, checked.event);
  assert.doesNotMatch(`${checked.event} ${input.last}`, /finish beam tuning|bar storm shutters|costs one turn|before the last turn/i);
});
