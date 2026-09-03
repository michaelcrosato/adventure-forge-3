import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects a whitespace-only objective", async () => {
  const world = await loadWorld();
  world.objective = " \n\t";

  assert.throws(
    () => validateWorld(world),
    /World requires a non-empty string objective/,
  );
});
