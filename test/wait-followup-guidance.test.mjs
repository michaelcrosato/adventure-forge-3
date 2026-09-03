import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("waiting for the horn points back to final beam tuning", async () => {
  const world = await loadWorld();
  const text = world.actions.wait_for_horn.text;

  assert.match(text, /spend one turn/i);
  assert.match(text, /finish any trim or alignment before lighting/i);
  assert.match(text, /remaining turn matters/i);
});
