import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the keeper no longer offers spare oil after the lantern is filled", async () => {
  const world = await loadWorld();
  const filled = replayActions(world, 37, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;

  assert.equal(filled.room, "keeper_room");
  assert.equal(legalActions(world, filled).includes("take_oil"), false);
});
