import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room advertises the sheltered shutter finish", async () => {
  const world = await loadWorld();
  const text = world.rooms.tower.text;

  assert.match(text, /bar shutters/i);
  assert.match(text, /sheltered finish/i);
});
