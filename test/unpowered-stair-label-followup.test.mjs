import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the unpowered stair label recommends filling after repair", async () => {
  const world = await loadWorld();
  const label = world.actions.climb_tower.label;

  assert.match(label, /repair first is faster/i);
  assert.match(label, /fill after repair/i);
});
