import test from "node:test";
import assert from "node:assert/strict";
import { loadWorld } from "../src/engine.mjs";

test("the all-ready fallback label says timing is a bonus", async () => {
  const world = await loadWorld();

  assert.match(world.actions.light_all_ready_beacon.label, /without timing bonus/i);
  assert.match(world.actions.light_all_ready_beacon.label, /fallback/i);
});
