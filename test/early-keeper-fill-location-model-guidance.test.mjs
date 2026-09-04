import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("early keeper input locates lantern filling in the tower", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 7402, ["take_lantern", "enter_house"]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /hand lantern will need oil before climbing unless already filled/i);
  assert.match(input.text, /take the oil before climbing; fill the lantern in the tower/i);
  assert.doesNotMatch(input.text, /hand lantern will need oil before climbing unless already filled/i);
});
