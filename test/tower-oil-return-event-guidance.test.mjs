import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the tower oil return names the rescue route that is still available", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 6041, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;

  const returned = step(world, tower, "return_keeper_from_tower");

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /basic beacon route can still rescue the boat/i);
  assert.doesNotMatch(returned.event, /moored boat can still be rescued/i);
});
