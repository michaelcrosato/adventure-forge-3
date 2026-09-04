import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("filled lantern copy does not repeat filling after the stair return closes", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 16002, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.flags.includes("lantern_filled"), true);
  assert.equal(legalActions(world, state).includes("climb_repaired_stairs"), false);
  assert.match(input.text, /repaired-stair return is closed; restore current in the workshop/i);
  assert.doesNotMatch(input.text, /after filling the lantern, restore current/i);
});
