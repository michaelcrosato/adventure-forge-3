import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("keeper-sequence feedback keeps its clear rescue budget", async () => {
  const world = await loadWorld();
  const text = world.actions.light_rescue_beacon.text;

  assert.ok(text.length < 145, `rescue feedback is ${text.length} characters`);
  assert.match(text, /keeper's sequence meets the tide mark/i);
  assert.match(text, /clean flame fills the aligned lens/i);
  assert.match(text, /waiting boat answers and turns safely into the channel/i);
});
