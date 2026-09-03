import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the repaired stair replaces the dark stair after current is restored", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 257, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "return_keeper_from_tower",
    "take_oil",
  ]).state;
  const legal = legalActions(world, keeper);

  assert.equal(legal.includes("climb_tower"), false);
  assert.equal(legal.includes("climb_repaired_stairs"), true);
});
