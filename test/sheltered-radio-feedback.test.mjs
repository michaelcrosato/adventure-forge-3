import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the strongest sheltered-radio finish gives the boat's horn response", async () => {
  const world = await loadWorld();
  const text = world.actions.light_sheltered_radio_beacon.text;

  assert.match(text, /three bright horn blasts/i);
  assert.match(text, /waiting boat turns safely/i);
});
