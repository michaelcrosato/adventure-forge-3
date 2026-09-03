import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects actions with no effects", async () => {
  const world = await loadWorld();
  world.actions.read_log.effects = [];

  assert.throws(
    () => validateWorld(world),
    /Action read_log requires label and effects/,
  );
});
