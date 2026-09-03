import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("a repaired tower sends the player to filling instead of back downstairs", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 43, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;

  assert.equal(tower.room, "tower");
  assert.equal(legalActions(world, tower).includes("return_keeper_from_tower"), false);
  assert.equal(legalActions(world, tower).includes("fill_lantern"), true);
});
