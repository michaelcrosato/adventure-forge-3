import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the filled keeper menu labels radio checking after filling", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7240, [
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
  const radio = observation(world, keeper).actions.find(([id]) => id === "check_storm_radio");

  assert.equal(legalActions(world, keeper).includes("check_storm_radio"), true);
  assert.match(radio[1], /check the storm radio after filling.*costs one turn/i);
  assert.doesNotMatch(radio[1], /before taking oil/i);
});
