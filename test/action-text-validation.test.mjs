import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects non-string action feedback", async () => {
  const world = await loadWorld();
  world.actions.read_log.text = 42;

  assert.throws(() => validateWorld(world), /Action read_log text must be a string/);
});
