import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room names the beacon as the lighting target", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.tower.text, /before lighting the beacon/i);
});
