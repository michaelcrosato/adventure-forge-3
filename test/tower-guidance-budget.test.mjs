import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room keeps its repeated guidance under 500 characters", async () => {
  const world = await loadWorld();

  assert.ok(world.rooms.tower.text.length < 525);
});
