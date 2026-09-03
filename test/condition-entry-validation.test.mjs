import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects a null condition entry cleanly", async () => {
  const world = await loadWorld();
  world.actions.read_log.when = [null];

  assert.throws(() => validateWorld(world), /Action read_log has an invalid condition/);
});
