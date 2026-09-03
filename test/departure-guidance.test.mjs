import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the alternate departure makes abandonment explicit", async () => {
  const world = await loadWorld();

  assert.match(world.actions.leave_island.label, /abandon the station/i);
  assert.match(world.actions.leave_island.text, /dark station/i);
});
