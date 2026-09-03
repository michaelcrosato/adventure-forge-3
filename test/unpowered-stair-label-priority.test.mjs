import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the unpowered stair label favors repairing the switchboard first", async () => {
  const world = await loadWorld();

  assert.match(world.actions.climb_tower.label, /unpowered stair/i);
  assert.match(world.actions.climb_tower.label, /repair first is faster/i);
});
