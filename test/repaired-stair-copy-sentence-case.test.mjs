import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("closed repaired-stair guidance keeps its inserted clause lowercase", async () => {
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

  assert.match(view.text, /; the repaired-stair return is closed;/);
  assert.doesNotMatch(view.text, /; The repaired-stair return is closed;/);
  assert.doesNotMatch(input.text, /; The repaired-stair return is closed;/);
});
