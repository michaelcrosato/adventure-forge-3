import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the chronometer finish gives the waiting boat's horn response", async () => {
  const world = await loadWorld();
  const text = world.actions.light_chronometer_beacon.text;

  assert.match(text, /chronometer chimes/i);
  assert.match(text, /three bright horn blasts/i);
  assert.match(text, /waiting boat turns safely/i);
});
