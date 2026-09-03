import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects blank room descriptions", async () => {
  const world = await loadWorld();
  world.rooms.tower.text = "";

  assert.throws(() => validateWorld(world), /Room tower requires title and text/);
});
