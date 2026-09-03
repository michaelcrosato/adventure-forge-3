import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a repaired tower can send the player back for missing oil", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 47, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;

  assert.equal(legalActions(world, tower).includes("return_keeper_from_tower"), true);
  const keeper = step(world, tower, "return_keeper_from_tower");
  assert.equal(keeper.ok, true, keeper.error);
  assert.equal(keeper.state.room, "keeper_room");
});
