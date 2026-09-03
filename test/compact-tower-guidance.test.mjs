import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room keeps its preparation guidance compact", async () => {
  const world = await loadWorld();
  const text = world.rooms.tower.text;

  assert.ok(text.length < 560);
  assert.match(text, /tower relay can confirm the radio channel/i);
  assert.match(
    text,
    /confirmed-channel rescue.*marked-tide rescue.*perfectly timed.*fully prepared/i,
  );
});
