import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("carried oil does not tell the model to fill a missing lantern", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 8304, ["enter_house", "take_oil"]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.inventory.includes("oil"), true);
  assert.equal(state.inventory.includes("lantern"), false);
  assert.equal(legalActions(world, state).includes("fill_lantern"), false);
  assert.match(view.text, /oil is ready; recover the lantern before filling/i);
  assert.match(input.text, /lantern is still missing; recover it before filling/i);
  assert.doesNotMatch(input.text, /oil is ready; fill the lantern before climbing/i);
});
