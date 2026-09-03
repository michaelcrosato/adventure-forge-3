import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room names the sheltered radio finish in its priority order", async () => {
  const world = await loadWorld();
  const text = world.rooms.tower.text;

  assert.match(text, /sheltered confirmed-channel rescue.*marked-tide rescue/i);
});
