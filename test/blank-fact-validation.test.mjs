import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects blank durable facts", async () => {
  const world = await loadWorld();
  world.actions.read_log.effects = [{ remember: " \n\t" }];

  assert.throws(() => validateWorld(world), /Action read_log remember facts must not be blank/);
});
