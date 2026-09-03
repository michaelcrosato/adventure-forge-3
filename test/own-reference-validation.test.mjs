import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects inherited room references", async () => {
  const world = await loadWorld();
  world.actions.read_log.effects = [{ move: "toString" }];

  assert.throws(
    () => validateWorld(world),
    /Action read_log moves to unknown room toString/,
  );
});
