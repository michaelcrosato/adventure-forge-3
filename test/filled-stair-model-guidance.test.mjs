import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("early-filled lantern model input drops the spent fill prerequisite", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 900005, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;
  const view = observation(world, keeper);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /after the lantern is filled, only with time/i);
  assert.match(input.text, /use the repaired stair after current is restored and supplies are ready/i);
  assert.doesNotMatch(input.text, /after the lantern is filled, only with time/i);
});
