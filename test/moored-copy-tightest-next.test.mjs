import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("unsignaled moored feedback keeps its direct rescue budget", async () => {
  const world = await loadWorld();
  const text = world.actions.light_moored_beacon.text;

  assert.ok(text.length < 128, `moored feedback is ${text.length} characters`);
  assert.match(text, /beacon catches/i);
  assert.match(text, /secured mooring holds/i);
  assert.match(text, /white beam cuts through the storm/i);
  assert.match(text, /boat turns safely toward the station/i);
});
