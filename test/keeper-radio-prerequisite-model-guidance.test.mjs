import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, modelTurnInput, observation, step } from "../src/engine.mjs";

test("keeper input postpones radio guidance until its prerequisites are ready", async () => {
  const world = await loadWorld();
  const state = step(world, createState(world, 1), "enter_house").state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, state).includes("check_storm_radio"), false);
  assert.match(input.text, /check the radio after the clues and boat are ready/i);
  assert.doesNotMatch(input.text, /check radio if needed before taking the oil/i);
});
