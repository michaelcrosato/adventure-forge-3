import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the repaired stair points carried oil toward lantern filling", async () => {
  const world = await loadWorld();

  assert.match(world.actions.climb_repaired_stairs.text, /fill the lantern if it still holds oil/i);
});
