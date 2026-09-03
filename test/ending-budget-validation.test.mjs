import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation bounds model-visible ending title and text", async () => {
  const world = await loadWorld();
  world.endings.timeout.title = "x".repeat(161);

  assert.throws(
    () => validateWorld(world),
    /Ending timeout title must be at most 160 characters/,
  );

  world.endings.timeout.title = "Too Late";
  world.endings.timeout.text = "x".repeat(561);

  assert.throws(
    () => validateWorld(world),
    /Ending timeout text must be at most 560 characters/,
  );
});
