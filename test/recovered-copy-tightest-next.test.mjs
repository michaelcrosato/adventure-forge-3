import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("recovered feedback keeps its split rescue outcome compact", async () => {
  const world = await loadWorld();
  const text = world.actions.light_recovered_beacon.text;

  assert.ok(text.length < 134, `recovered feedback is ${text.length} characters`);
  assert.match(text, /emergency recovery pays off/i);
  assert.match(text, /beacon catches/i);
  assert.match(text, /waiting boat answers/i);
  assert.match(text, /secured mooring carries the rescue through the storm/i);
});
