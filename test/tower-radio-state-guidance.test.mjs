import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the tower observation stops repeating a completed radio check", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 8801, [
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
  ]).state;
  const text = observation(world, tower).text;

  assert.equal(legalActions(world, tower).includes("check_tower_radio"), false);
  assert.match(text, /radio channel already confirmed/i);
  assert.doesNotMatch(text, /tower relay can confirm the radio channel/i);
});
