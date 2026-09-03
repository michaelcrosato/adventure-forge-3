import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects an empty winning plan", async () => {
  const world = await loadWorld();
  world.winningPlan = [];

  assert.throws(() => validateWorld(world), /World winningPlan must contain known action IDs/);
});
