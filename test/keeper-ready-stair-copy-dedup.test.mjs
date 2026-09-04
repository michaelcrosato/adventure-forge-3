import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("ready repaired-stair guidance puts filling in the tower", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 16009, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));
  const fillMentions = input.text.match(/fill the lantern/gi) ?? [];

  assert.equal(legalActions(world, state).includes("climb_repaired_stairs"), true);
  assert.equal(fillMentions.length, 1);
  assert.match(input.text, /oil is ready; use the repaired stair now; fill the lantern in the tower if needed/i);
  assert.doesNotMatch(input.text, /fill the lantern before climbing/i);
});
