import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the keeper-room cue names the remaining clues", async () => {
  const world = await loadWorld();
  const text = world.rooms.keeper_room.text;

  assert.match(text, /read remaining clues/i);
});
