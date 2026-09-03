import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("sheltered-radio feedback keeps its tightened rescue budget", async () => {
  const world = await loadWorld();
  const text = world.actions.light_sheltered_radio_beacon.text;

  assert.ok(text.length < 170, `sheltered-radio feedback is ${text.length} characters`);
  assert.match(text, /clear channel/i);
  assert.match(text, /barred shutters/i);
  assert.match(text, /clean flame fills the aligned lens/i);
  assert.match(text, /three bright horn blasts/i);
  assert.match(text, /waiting boat turns safely/i);
});
