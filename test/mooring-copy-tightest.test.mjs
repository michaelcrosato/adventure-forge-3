import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("mooring feedback keeps its tightened route budget", async () => {
  const world = await loadWorld();
  const text = world.actions.secure_mooring.text;

  assert.ok(text.length < 180, `mooring feedback is ${text.length} characters`);
  assert.match(text, /opening the way to a stronger rescue/i);
  assert.match(text, /signal it from the keeper's room for a confirmed channel/i);
  assert.match(text, /keep the mooring secured and light for the boat directly/i);
});
