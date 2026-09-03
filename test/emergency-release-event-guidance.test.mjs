import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the emergency release names the basic route when mooring is unsecured", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 6041, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;

  const returned = step(world, workshop, "return_keeper_after_repair");

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /basic beacon route can still rescue the boat/i);
  assert.doesNotMatch(returned.event, /moored boat can still be rescued/i);
});
