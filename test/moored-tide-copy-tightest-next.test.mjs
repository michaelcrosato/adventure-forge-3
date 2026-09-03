import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("marked-tide feedback keeps its split rescue outcome compact", async () => {
  const world = await loadWorld();
  const text = world.actions.light_moored_tide_beacon.text;

  assert.ok(text.length < 138, `marked-tide feedback is ${text.length} characters`);
  assert.match(text, /marked tide guides the secured boat/i);
  assert.match(text, /beacon cuts through the storm/i);
  assert.match(text, /mooring holds\. the boat turns safely toward the station/i);
});
