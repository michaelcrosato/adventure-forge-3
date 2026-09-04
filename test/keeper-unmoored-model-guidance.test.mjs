import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, modelTurnInput, observation, step } from "../src/engine.mjs";

test("unsecured keeper input puts mooring before signaling", async () => {
  const world = await loadWorld();
  const state = step(world, createState(world, 1), "enter_house").state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, state).includes("signal_boat"), false);
  assert.match(input.text, /secure the mooring before signaling if needed/i);
  assert.doesNotMatch(input.text, /signal the boat first if needed/i);
});
