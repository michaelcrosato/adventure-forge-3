import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the bounded keeper input stops repeating the oil prerequisite after early filling", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 2706, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.flags.includes("lantern_filled"), true);
  assert.equal(legalActions(world, state).includes("fill_lantern"), false);
  assert.match(view.text, /before climbing unless already filled/i);
  assert.match(input.text, /lantern is already filled/i);
  assert.doesNotMatch(input.text, /hand lantern will need oil before climbing unless already filled/i);
});
