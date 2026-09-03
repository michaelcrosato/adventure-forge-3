import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects a missing room map cleanly", async () => {
  const world = await loadWorld();
  delete world.rooms;

  assert.throws(() => validateWorld(world), /World requires rooms/);
});
