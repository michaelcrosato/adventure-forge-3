import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tower explains the relay's clue prerequisites", async () => {
  const world = await loadWorld();
  const text = world.rooms.tower.text;

  assert.match(text, /log and tide chart are recorded/i);
  assert.match(text, /tower relay can confirm the radio channel/i);
  assert.match(text, /after the lantern is filled/i);
});
