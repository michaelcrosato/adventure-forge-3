import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation bounds model-visible ending identifiers", async () => {
  const world = await loadWorld();
  const longEndingId = "e".repeat(161);
  world.endings[longEndingId] = { title: "Spare ending", text: "A spare ending." };

  assert.throws(
    () => validateWorld(world),
    /Ending .* identifier must be at most 160 characters/,
  );

  delete world.endings[longEndingId];
  world.endings["  "] = { title: "Spare ending", text: "A spare ending." };

  assert.throws(() => validateWorld(world), /Ending identifier must not be blank/);
});
