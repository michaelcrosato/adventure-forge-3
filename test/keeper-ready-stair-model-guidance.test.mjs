import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("ready keeper input says the repaired stair is available now", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 13001, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
  ]).state;
  const input = modelTurnInput(world, observation(world, keeper));

  assert.equal(legalActions(world, keeper).includes("climb_repaired_stairs"), true);
  assert.match(input.text, /use the repaired stair now; fill the lantern in the tower if needed/i);
  assert.doesNotMatch(input.text, /once current is restored and supplies are ready/i);
});
