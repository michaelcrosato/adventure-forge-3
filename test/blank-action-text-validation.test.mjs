import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects blank action feedback", async () => {
  const world = await loadWorld();
  world.actions.read_log.text = " \n\t";

  assert.throws(() => validateWorld(world), /Action read_log text must not be blank/);
});
