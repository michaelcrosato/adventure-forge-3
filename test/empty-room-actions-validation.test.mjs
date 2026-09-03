import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects rooms with no available action menu", async () => {
  const world = await loadWorld();
  world.rooms.tower.actions = [];

  assert.throws(
    () => validateWorld(world),
    /Room tower requires at least one action/,
  );
});
