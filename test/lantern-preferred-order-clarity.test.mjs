import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("lantern pickup distinguishes preferred order from a hard gate", async () => {
  const world = await loadWorld();
  const text = world.actions.take_lantern.text;

  assert.match(text, /secure the mooring line before entering when able/i);
  assert.match(text, /signal the boat from the keeper's room/i);
  assert.ok(text.length < 125);
});
