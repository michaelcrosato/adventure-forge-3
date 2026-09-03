import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room explains how to choose among lighting finishes", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.tower.text, /several lighting choices/i);
  assert.match(world.rooms.tower.text, /most preparation/i);
});
