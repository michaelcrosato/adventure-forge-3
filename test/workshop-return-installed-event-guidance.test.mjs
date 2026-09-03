import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the repaired workshop backtrack does not repeat fuse installation", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 5301, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;

  const returned = step(world, workshop, "return_keeper_from_workshop");

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /current is already restored.*use the repaired stair/i);
  assert.doesNotMatch(returned.event, /take and install the fuse|return to the workshop/i);
});
