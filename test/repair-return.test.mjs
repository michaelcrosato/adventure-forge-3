import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a repaired workshop keeps one emergency return for missing supplies", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 277, [
    "enter_house",
    "go_workshop",
    "return_keeper_from_workshop",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;

  assert.equal(legalActions(world, workshop).includes("return_keeper_after_repair"), true);
  const keeper = step(world, workshop, "return_keeper_after_repair");
  assert.equal(keeper.ok, true, keeper.error);
  assert.equal(keeper.state.room, "keeper_room");
  assert.equal(keeper.state.flags.includes("repair_return_used"), true);
});
