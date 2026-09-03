import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation bounds model-visible objective and room title", async () => {
  const world = await loadWorld();
  world.objective = "x".repeat(561);

  assert.throws(
    () => validateWorld(world),
    /World objective must be at most 560 characters/,
  );

  world.objective = "A short objective.";
  world.rooms.tower.title = "x".repeat(161);

  assert.throws(
    () => validateWorld(world),
    /Room tower title must be at most 160 characters/,
  );
});
