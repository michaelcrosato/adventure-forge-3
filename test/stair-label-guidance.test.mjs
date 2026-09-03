import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("stair action labels identify whether the route is powered", async () => {
  const world = await loadWorld();
  const unpowered = world.actions.climb_tower.label;
  const repaired = world.actions.climb_repaired_stairs.label;

  assert.match(unpowered, /unpowered stair/i);
  assert.match(repaired, /lantern room/i);
  assert.notEqual(unpowered, repaired);
});
