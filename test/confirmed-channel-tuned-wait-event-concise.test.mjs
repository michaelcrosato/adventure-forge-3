import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("confirmed-channel horn feedback reports completed tuning without repeating the route", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 100017, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;

  const waited = step(world, tower, "wait_for_horn");

  assert.equal(waited.ok, true, waited.error);
  assert.equal(waited.event, "Horn timing recorded; beam tuning is complete.");
  assert.doesNotMatch(waited.event, /after tuning|light next turn|never wait/i);

  const input = modelTurnInput(world, observation(world, waited.state, waited.event));
  assert.equal(input.last, "Horn bonus recorded; light the confirmed-channel beacon now.");
});
