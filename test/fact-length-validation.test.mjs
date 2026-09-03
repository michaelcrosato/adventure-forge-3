import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation bounds durable player facts", async () => {
  const world = await loadWorld();
  world.actions.read_log.effects = [{ remember: "x".repeat(281) }];

  assert.throws(
    () => validateWorld(world),
    /Action read_log remember facts must be at most 280 characters/,
  );
});
