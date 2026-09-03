import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the storm-radio label exposes its before-oil timing", async () => {
  const world = await loadWorld();
  const label = world.actions.check_storm_radio.label;

  assert.match(label, /before taking oil/i);
  assert.match(label, /costs one turn/i);
});
