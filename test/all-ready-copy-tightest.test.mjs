import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("all-ready feedback keeps its clear fallback budget", async () => {
  const world = await loadWorld();
  const text = world.actions.light_all_ready_beacon.text;

  assert.ok(text.length < 132, `all-ready feedback is ${text.length} characters`);
  assert.match(text, /aligned lens catches the clean flame/i);
  assert.match(text, /three bright horn blasts answer/i);
  assert.match(text, /true beam guides the waiting boat into the channel/i);
});
