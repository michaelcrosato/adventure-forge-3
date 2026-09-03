import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects a null room entry cleanly", async () => {
  const world = await loadWorld();
  world.rooms.tower = null;

  assert.throws(() => validateWorld(world), /Room tower requires title and text/);
});
