import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("perfectly timed feedback keeps its split rescue outcome compact", async () => {
  const world = await loadWorld();
  const text = world.actions.light_timed_beacon.text;

  assert.ok(text.length < 143, `timed feedback is ${text.length} characters`);
  assert.match(text, /perfect tide/i);
  assert.match(text, /aligned lens catches the clean flame/i);
  assert.match(text, /three bright horn blasts answer\. the waiting boat clears the channel before it turns/i);
});
