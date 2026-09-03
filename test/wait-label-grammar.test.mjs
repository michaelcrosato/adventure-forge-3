import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn-wait label separates its timing reward clearly", async () => {
  const world = await loadWorld();

  assert.match(world.actions.wait_for_horn.label, /after beam tuning: timing bonus/i);
});
