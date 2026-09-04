import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper model input names the service ladder when repaired-stair return is closed", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 1, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.room, "keeper_room");
  assert.equal(state.turn, 5);
  assert.equal(legalActions(world, state).includes("climb_repaired_stairs"), false);
  assert.match(view.text, /repaired-stair return is closed.*service ladder/i);
  assert.match(input.text, /repaired-stair return is closed.*service ladder/i);
  assert.doesNotMatch(input.text, /use the repaired stair once current is restored/i);
});
