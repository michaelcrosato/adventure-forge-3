import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("horn-timed feedback keeps its direct timing outcome compact", async () => {
  const world = await loadWorld();
  const text = world.actions.light_horn_timed_beacon.text;

  assert.ok(text.length < 120, `horn-timed feedback is ${text.length} characters`);
  assert.match(text, /next horn sounds as the aligned lens catches the clean flame/i);
  assert.match(text, /waiting boat answers before the channel turns/i);
});
