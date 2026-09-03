import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("moored-tuned feedback keeps both preparation outcomes compact", async () => {
  const world = await loadWorld();
  const text = world.actions.light_moored_aligned_trimmed_beacon.text;

  assert.ok(text.length < 160, `moored-tuned feedback is ${text.length} characters`);
  assert.match(text, /secured mooring steadies the rescue/i);
  assert.match(text, /aligned lens catches the clean flame/i);
  assert.match(text, /true beam holds across the storm/i);
  assert.match(text, /boat turns safely toward the station/i);
});
