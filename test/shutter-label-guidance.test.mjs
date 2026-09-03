import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the shutter label exposes its turn cost and preparation order", async () => {
  const world = await loadWorld();
  const label = world.actions.close_storm_shutters.label;

  assert.match(label, /costs one turn/i);
  assert.match(label, /finish trim\/alignment first/i);
});
