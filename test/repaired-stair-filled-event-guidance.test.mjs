import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the repaired stair event skips filling an already-filled lantern", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 5401, [
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

  const climbed = step(world, keeper, "climb_repaired_stairs");

  assert.equal(climbed.ok, true, climbed.error);
  assert.match(climbed.event, /lantern already filled.*continue the beacon work above/i);
  assert.doesNotMatch(climbed.event, /fill the lantern if it still holds oil/i);
});
