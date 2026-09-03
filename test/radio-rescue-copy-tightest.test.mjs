import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("radio-rescue feedback keeps its tightened rescue budget", async () => {
  const world = await loadWorld();
  const text = world.actions.light_radio_rescue_beacon.text;

  assert.ok(text.length < 165, `radio-rescue feedback is ${text.length} characters`);
  assert.match(text, /radio confirms a clear channel/i);
  assert.match(text, /keeper's sequence and tide mark/i);
  assert.match(text, /clean flame fills the aligned lens/i);
  assert.match(text, /waiting boat turns safely/i);
});
