import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects effects that name unknown items", async () => {
  const world = await loadWorld();
  world.actions.read_log.effects = [{ take: "missing_item" }];

  assert.throws(() => validateWorld(world), /Action read_log references unknown item/);
});
