import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("moored-tide-tuned feedback keeps its tightened rescue budget", async () => {
  const world = await loadWorld();
  const text = world.actions.light_moored_tide_tuned_beacon.text;

  assert.ok(text.length < 145, `moored-tide-tuned feedback is ${text.length} characters`);
  assert.match(text, /marked tide meets the tuned lens/i);
  assert.match(text, /secured mooring holds/i);
  assert.match(text, /clean beam cuts across the storm/i);
  assert.match(text, /boat turns safely toward the station/i);
});
