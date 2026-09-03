import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn-wait label signals that beam tuning comes first", async () => {
  const world = await loadWorld();
  const label = world.actions.wait_for_horn.label;

  assert.match(label, /one turn/i);
  assert.match(label, /timing bonus/i);
  assert.match(label, /after beam tuning/i);
});
