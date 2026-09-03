import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the keeper room does not call the repaired stair dark", async () => {
  const world = await loadWorld();

  assert.doesNotMatch(world.rooms.keeper_room.text, /dark tower stair/i);
  assert.match(world.rooms.keeper_room.text, /repaired stair/i);
});
