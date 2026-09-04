import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, modelTurnInput, observation, step } from "../src/engine.mjs";

test("early keeper model text explains when the radio becomes available", async () => {
  const world = await loadWorld();
  const state = step(world, createState(world, 142), "enter_house").state;
  const input = modelTurnInput(world, observation(world, state));

  assert.equal(legalActions(world, state).includes("check_storm_radio"), false);
  assert.match(input.text, /check the radio after the clues and boat are ready; it becomes available after the tide chart/i);
  assert.doesNotMatch(input.text, /check radio if needed before taking the oil/i);
});
