import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a prepared tower does not offer a misleading return action", async () => {
  const world = await loadWorld();
  const ready = replayActions(world, 29, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  assert.equal(legalActions(world, ready).includes("return_keeper_from_tower"), false);
  assert.equal(legalActions(world, ready).includes("return_keeper_after_fill"), false);
  assert.equal(legalActions(world, ready).includes("light_beacon"), true);
});

test("a filled lantern can still return when the fuse remains unrepaired", async () => {
  const world = await loadWorld();
  const filled = replayActions(world, 31, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
  ]).state;

  assert.equal(legalActions(world, filled).includes("return_keeper_from_tower"), false);
  assert.equal(legalActions(world, filled).includes("return_keeper_after_fill"), true);
  const keeper = step(world, filled, "return_keeper_after_fill");
  assert.equal(keeper.ok, true, keeper.error);
  assert.equal(keeper.state.room, "keeper_room");
});
