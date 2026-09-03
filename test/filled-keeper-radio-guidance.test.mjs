import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("an early filled lantern makes the keeper-room radio timing state-aware", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7212, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;
  const text = observation(world, keeper).text;

  assert.equal(keeper.flags.includes("lantern_filled"), true);
  assert.equal(legalActions(world, keeper).includes("check_storm_radio"), true);
  assert.match(text, /lantern filled; check the radio now if time allows/i);
  assert.doesNotMatch(text, /before taking the oil/i);
});
