import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the committed winning plan uses the repaired service ladder", async () => {
  const world = await loadWorld();

  assert.equal(world.winningPlan.includes("climb_service_ladder"), true);
  assert.equal(world.winningPlan.includes("return_keeper_from_workshop"), false);
  assert.equal(world.winningPlan.length, 9);
  assert.equal(replayActions(world, 17, world.winningPlan).state.ending, "beacon");
});
