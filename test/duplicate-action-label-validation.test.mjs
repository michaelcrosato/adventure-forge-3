import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects duplicate visible action labels", async () => {
  const world = await loadWorld();
  world.actions.enter_house.label = world.actions.leave_island.label;

  assert.throws(
    () => validateWorld(world),
    /Room jetty action list contains duplicate labels/,
  );
});
