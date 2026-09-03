import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("keeper-room guidance stays compact without losing route cues", async () => {
  const world = await loadWorld();
  const text = world.rooms.keeper_room.text;

  assert.ok(text.length < 395);
  assert.match(text, /hand lantern will need oil.*signal the boat first.*repaired stair.*secure the mooring before studying tide/i);
});
