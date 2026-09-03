import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects duplicate room actions", async () => {
  const world = await loadWorld();
  world.rooms.jetty.actions.push("take_lantern");

  assert.throws(() => validateWorld(world), /Room jetty action list contains duplicates/);
});
