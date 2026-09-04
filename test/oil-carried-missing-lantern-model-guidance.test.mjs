import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("bounded keeper input names lantern recovery before filling carried oil", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 8303, ["enter_house", "take_oil"]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.inventory.includes("oil"), true);
  assert.equal(state.inventory.includes("lantern"), false);
  assert.equal(legalActions(world, state).includes("fill_lantern"), false);
  assert.equal(legalActions(world, state).includes("go_jetty"), true);
  assert.match(view.text, /hand lantern will need oil before climbing unless already filled/i);
  assert.match(input.text, /lantern is still missing; recover it before filling/i);
  assert.doesNotMatch(input.text, /hand lantern will need oil before climbing unless already filled/i);
});
