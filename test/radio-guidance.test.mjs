import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the keeper explains the radio's before-oil timing", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.keeper_room.text, /before taking the oil/i);
  assert.match(world.rooms.keeper_room.text, /signal the boat first/i);
});
