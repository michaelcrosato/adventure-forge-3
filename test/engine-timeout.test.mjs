import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation requires the ending used when the turn limit expires", async () => {
  const world = await loadWorld();
  delete world.endings.timeout;

  assert.throws(() => validateWorld(world), /timeout ending/);
});
