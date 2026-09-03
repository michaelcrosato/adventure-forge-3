import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("the tower observation stops repeating completed shutter preparation", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 8901, [
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
  ]).state;
  const closed = step(world, tower, "close_storm_shutters");
  const text = observation(world, closed.state).text;

  assert.equal(closed.ok, true, closed.error);
  assert.equal(legalActions(world, closed.state).includes("close_storm_shutters"), false);
  assert.match(text, /shutters barred: sheltered finish ready/i);
  assert.doesNotMatch(text, /bar shutters: sheltered finish/i);
});
