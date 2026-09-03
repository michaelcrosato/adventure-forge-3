import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("repaired-stair feedback stays compact for routing turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.climb_repaired_stairs.text.length < 125);
});
