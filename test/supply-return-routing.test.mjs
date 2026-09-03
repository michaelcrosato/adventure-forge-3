import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a tower supply rescue closes the repaired workshop loop", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 313, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;

  const keeper = step(world, tower, "return_keeper_from_tower");
  assert.equal(keeper.ok, true, keeper.error);
  assert.equal(keeper.state.flags.includes("supply_return_used"), true);
  assert.equal(legalActions(world, keeper.state).includes("go_workshop"), false);

  const supplied = step(world, keeper.state, "take_oil");
  assert.equal(supplied.ok, true, supplied.error);
  assert.equal(legalActions(world, supplied.state).includes("climb_repaired_stairs"), true);
});

test("an emergency supply release also closes the repaired workshop loop", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 317, [
    "enter_house",
    "go_workshop",
    "return_keeper_from_workshop",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;

  const keeper = step(world, workshop, "return_keeper_after_repair");
  assert.equal(keeper.ok, true, keeper.error);
  assert.equal(legalActions(world, keeper.state).includes("go_workshop"), false);
});
