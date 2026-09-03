import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the repaired stair accepts a lantern that was filled before the repair", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 527, [
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

  assert.equal(keeper.flags.includes("lantern_filled"), true);
  assert.equal(keeper.flags.includes("fuse_installed"), true);
  assert.equal(keeper.inventory.includes("oil"), false);
  assert.equal(legalActions(world, keeper).includes("climb_repaired_stairs"), true);
});
