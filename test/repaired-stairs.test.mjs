import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("restored current opens a direct keeper-room stair shortcut", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 251, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "return_keeper_from_tower",
    "take_oil",
  ]).state;

  assert.equal(legalActions(world, keeper).includes("climb_repaired_stairs"), true);
  const tower = step(world, keeper, "climb_repaired_stairs");
  assert.equal(tower.ok, true, tower.error);
  assert.equal(tower.state.room, "tower");
});
