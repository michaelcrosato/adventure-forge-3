import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("keeper observation does not repeat a checked radio", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 8104, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const text = observation(world, state).text;

  assert.match(text, /radio channel already confirmed; oil is ready; the repaired-stair return is closed/i);
  assert.doesNotMatch(text, /radio channel already confirmed; check radio if needed/i);
  assert.match(text, /boat signal already confirmed/i);
  assert.doesNotMatch(text, /signal the boat first if needed/i);
});
