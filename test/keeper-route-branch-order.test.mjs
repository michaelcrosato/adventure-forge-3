import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("keeper-room guidance separates unsecured recovery from the secured optional route", async () => {
  const world = await loadWorld();
  const text = world.rooms.keeper_room.text;

  assert.match(
    text,
    /if unsecured: read the log, take oil, then return to secure the mooring before studying tide/i,
  );
  assert.match(text, /signal the boat first if needed; check radio if needed before taking the oil/i);
  assert.ok(text.length < 395);
});
