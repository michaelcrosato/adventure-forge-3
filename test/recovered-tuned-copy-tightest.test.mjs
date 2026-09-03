import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("recovered-tuned feedback keeps its tightened rescue budget", async () => {
  const world = await loadWorld();
  const text = world.actions.light_recovered_tuned_beacon.text;

  assert.ok(text.length < 145, `recovered-tuned feedback is ${text.length} characters`);
  assert.match(text, /recovered lantern burns cleanly/i);
  assert.match(text, /aligned lens/i);
  assert.match(text, /waiting boat answers/i);
  assert.match(text, /secured mooring carries the rescue through the storm/i);
});
