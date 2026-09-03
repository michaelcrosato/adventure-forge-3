import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("trimming the wick makes the remaining lens action explicit", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 3971, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  const trimmed = step(world, tower, "trim_wick");

  assert.equal(trimmed.ok, true, trimmed.error);
  assert.match(trimmed.event, /align the beacon lens before lighting for the strongest rescue/i);
  assert.doesNotMatch(trimmed.event, /if it is not already aligned/i);
});
