import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the optional shutter action leads with a plain close verb", async () => {
  const world = await loadWorld();
  const label = world.actions.close_storm_shutters.label;

  assert.match(label, /^Optional: close storm shutters/i);
  assert.match(label, /costs one turn/i);
});
