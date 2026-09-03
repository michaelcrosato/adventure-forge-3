import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the workshop return is a one-time backtrack", async () => {
  const world = await loadWorld();
  const returned = replayActions(world, 107, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "return_keeper_from_workshop",
    "go_workshop",
  ]).state;

  assert.equal(returned.flags.includes("workshop_return_used"), true);
  assert.equal(legalActions(world, returned).includes("return_keeper_from_workshop"), false);
  assert.equal(legalActions(world, returned).includes("take_fuse"), true);
});
