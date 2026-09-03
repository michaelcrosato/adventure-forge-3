import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects an invalid item map cleanly", async () => {
  const world = await loadWorld();
  world.items = [];

  assert.throws(() => validateWorld(world), /World items must be an object/);
});
