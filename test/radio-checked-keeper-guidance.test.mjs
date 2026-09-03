import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("a checked radio points to oil pickup instead of repeating the check", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7229, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
  ]).state;
  const text = observation(world, keeper).text;

  assert.equal(keeper.flags.includes("radio_checked"), true);
  assert.equal(keeper.inventory.includes("oil"), false);
  assert.equal(legalActions(world, keeper).includes("take_oil"), true);
  assert.match(text, /radio channel already confirmed; take the oil when ready/i);
  assert.doesNotMatch(text, /check radio if needed before taking the oil/i);
});
