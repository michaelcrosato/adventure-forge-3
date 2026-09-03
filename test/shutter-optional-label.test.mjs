import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the storm-shutter label identifies optional preparation", async () => {
  const world = await loadWorld();
  assert.match(world.actions.close_storm_shutters.label, /^Optional:/i);
});
