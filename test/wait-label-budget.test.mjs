import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn-wait label stays compact for bounded turn input", async () => {
  const world = await loadWorld();
  const label = world.actions.wait_for_horn.label;

  assert.ok(label.length < 105);
  assert.match(label, /timing bonus/i);
  assert.match(label, /one turn remaining.*light now/i);
});
