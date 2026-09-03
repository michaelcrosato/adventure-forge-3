import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("sheltered-chronometer feedback keeps its tightened rescue budget", async () => {
  const world = await loadWorld();
  const text = world.actions.light_sheltered_chronometer_beacon.text;

  assert.ok(text.length < 165, `sheltered-chronometer feedback is ${text.length} characters`);
  assert.match(text, /barred shutters/i);
  assert.match(text, /chronometer chimes on the marked tide/i);
  assert.match(text, /clean flame fills the aligned lens/i);
  assert.match(text, /waiting boat turns safely/i);
});
