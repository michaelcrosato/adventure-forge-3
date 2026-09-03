import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the unpowered stair label names the chronometer timing action", async () => {
  const world = await loadWorld();

  assert.match(world.actions.climb_tower.label, /wind the tower chronometer before early fill/i);
});
