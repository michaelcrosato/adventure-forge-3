import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the keeper room keeps its route guidance compact", async () => {
  const world = await loadWorld();
  const text = world.rooms.keeper_room.text;

  assert.ok(text.length < 400);
  assert.match(text, /hand lantern will need oil/i);
  assert.match(text, /signal the boat first.*before taking the oil.*after the lantern is filled/i);
  assert.match(text, /repaired stair/i);
});
