import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper model input drops radio guidance when both recovery routes are closed", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 1, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.room, "keeper_room");
  assert.equal(state.turn, 6);
  assert.equal(legalActions(world, state).includes("check_storm_radio"), false);
  assert.equal(legalActions(world, state).includes("check_tower_radio"), false);
  assert.match(input.text, /secured-boat and radio routes are unavailable/i);
  assert.doesNotMatch(input.text, /check the radio after the clues|radio check can wait|check radio if needed/i);
});
