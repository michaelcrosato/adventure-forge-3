import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("filling the hand lantern states that the beacon is still dark", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 4091, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;

  const filled = step(world, tower, "fill_lantern");

  assert.equal(filled.ok, true, filled.error);
  assert.match(filled.event, /hand lantern filled.*small flame holds steady/i);
  assert.match(filled.event, /beacon dark/i);
});
