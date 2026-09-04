import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("a fully supplied workshop return points to the service ladder", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 1, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
  ]).state;
  const returned = step(world, workshop, "return_keeper_from_workshop");
  const input = modelTurnInput(world, observation(world, returned.state, returned.event));

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /take and install the fuse.*service ladder/i);
  assert.doesNotMatch(returned.event, /use the repaired stair/i);
  assert.match(input.last, /take and install the fuse.*service ladder/i);
  assert.doesNotMatch(input.last, /use the repaired stair/i);
});
