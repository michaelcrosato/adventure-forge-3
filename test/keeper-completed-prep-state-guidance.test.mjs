import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper guidance drops completed boat and radio actions", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 12002, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const view = observation(world, keeper);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, keeper).includes("signal_boat"), false);
  assert.equal(legalActions(world, keeper).includes("check_storm_radio"), false);
  assert.match(input.text, /boat signal already confirmed/i);
  assert.match(input.text, /radio channel already confirmed; oil is ready; fill the lantern/i);
  assert.doesNotMatch(input.text, /signal the boat first if needed/i);
  assert.doesNotMatch(input.text, /check radio if needed/i);
});
