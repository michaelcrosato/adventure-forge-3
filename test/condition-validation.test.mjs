import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects a non-array action condition list", async () => {
  const world = await loadWorld();
  world.actions.read_log.when = { notFlag: "read_log" };

  assert.throws(() => validateWorld(world), /Action read_log when must be an array/);
});
