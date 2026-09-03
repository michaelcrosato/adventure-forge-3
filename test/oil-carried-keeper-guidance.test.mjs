import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("carried oil points to filling instead of repeating the before-oil check", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7231, [
    "take_lantern",
    "enter_house",
    "take_oil",
  ]).state;
  const text = observation(world, keeper).text;

  assert.equal(keeper.inventory.includes("oil"), true);
  assert.equal(keeper.flags.includes("radio_checked"), false);
  assert.equal(legalActions(world, keeper).includes("check_storm_radio"), false);
  assert.match(text, /oil is ready; fill the lantern before climbing/i);
  assert.doesNotMatch(text, /check radio if needed before taking the oil/i);
});
