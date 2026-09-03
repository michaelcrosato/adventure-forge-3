import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("trimming the wick confirms when lens alignment remains unfinished", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 4019, [
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
  assert.match(trimmed.event, /lens remains unaligned/i);
  assert.match(trimmed.event, /light the trimmed beacon now/i);
});
