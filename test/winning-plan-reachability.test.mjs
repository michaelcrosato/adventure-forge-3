import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects a winning plan that does not reach the beacon", async () => {
  const world = await loadWorld();
  world.winningPlan = ["take_lantern", "leave_island"];

  assert.throws(
    () => validateWorld(world),
    /World winningPlan must replay to beacon/,
  );
});
