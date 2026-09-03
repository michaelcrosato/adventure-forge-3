import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects a null durable fact cleanly", async () => {
  const world = await loadWorld();
  world.actions.read_log.effects = [{ remember: null }];

  assert.throws(
    () => validateWorld(world),
    /Action read_log effect remember must be a string/,
  );
});
