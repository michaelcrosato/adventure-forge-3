import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room states the finale priority order", async () => {
  const world = await loadWorld();
  const text = world.rooms.tower.text;
  const priority = /confirmed-channel rescue.*marked-tide rescue.*perfectly timed.*fully prepared/i;

  assert.match(text, priority);
});
