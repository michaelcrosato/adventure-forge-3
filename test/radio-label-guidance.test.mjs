import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the storm-radio label exposes its turn cost to the model", async () => {
  const world = await loadWorld();
  assert.match(world.actions.check_storm_radio.label, /costs one turn/i);
});
