import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects whitespace-only action labels", async () => {
  const world = await loadWorld();
  world.actions.read_log.label = "   \t";

  assert.throws(
    () => validateWorld(world),
    /Action read_log requires label and effects/,
  );
});
