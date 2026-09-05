import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("late confirmed-channel horn choice names its optional bonus", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 764023, [
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
    "check_tower_radio",
  ]).state;
  const wait = observation(world, tower).actions.find(([id]) => id === "wait_for_horn");

  assert.equal(tower.turn, world.maxTurns - 6);
  assert.ok(wait);
  assert.equal(wait[1], "Wait for the horn; confirmed-channel finish gains an optional timing bonus");

  const waited = step(world, tower, "wait_for_horn");
  assert.equal(waited.ok, true, waited.error);
  assert.match(waited.event, /confirmed-channel finish gains an optional timing bonus/i);
});
