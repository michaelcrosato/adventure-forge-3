import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the unpowered stair label explains how to keep chronometer timing", async () => {
  const world = await loadWorld();

  assert.match(world.actions.climb_tower.label, /fill after repair to keep chronometer timing/i);
});
