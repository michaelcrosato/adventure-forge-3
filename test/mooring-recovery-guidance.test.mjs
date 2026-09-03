import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the keeper room explains the early mooring recovery order", async () => {
  const world = await loadWorld();
  const text = world.rooms.keeper_room.text;

  assert.match(text, /read the log, take oil, then return to secure the mooring before studying tide/i);
  assert.ok(text.length < 400);
});
