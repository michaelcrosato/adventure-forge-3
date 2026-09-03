import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("unpowered-stair feedback keeps a tighter event budget", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.climb_tower.text.length < 210);
});
