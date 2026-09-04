import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("filled lantern ready-stair model input does not repeat filling", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 16001, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
  ]).state;
  const view = observation(world, keeper);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, keeper).includes("climb_repaired_stairs"), true);
  assert.match(view.text, /after the lantern is filled, only with time/i);
  assert.match(input.text, /use the repaired stair now; the lantern is already filled/i);
  assert.doesNotMatch(input.text, /fill the lantern in the tower if needed/i);
  assert.doesNotMatch(input.text, /after the lantern is filled, only with time/i);
});
