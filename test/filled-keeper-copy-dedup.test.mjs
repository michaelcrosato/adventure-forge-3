import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("filled keeper guidance states the lantern once after repair", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 16006, [
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
  const input = modelTurnInput(world, observation(world, state));
  const filledMentions = input.text.match(/lantern(?: is)?(?: already)? filled/gi) ?? [];

  assert.equal(legalActions(world, state).includes("climb_repaired_stairs"), true);
  assert.equal(filledMentions.length, 1);
  assert.match(input.text, /use the repaired stair now; the lantern is already filled/i);
  assert.doesNotMatch(input.text, /; lantern filled;/i);
});
