import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("workshop return feedback names only supplies still missing", async () => {
  const world = await loadWorld();
  const missing = replayActions(world, 5201, ["enter_house", "go_workshop"]).state;
  const missingResult = step(world, missing, "return_keeper_from_workshop");

  assert.equal(missingResult.ok, true, missingResult.error);
  assert.match(missingResult.event, /take the lantern and oil if needed.*return to the workshop/i);
  assert.doesNotMatch(missingResult.event, /fuse is already installed/i);

  const supplied = replayActions(world, 5202, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
  ]).state;
  const suppliedResult = step(world, supplied, "return_keeper_from_workshop");

  assert.equal(suppliedResult.ok, true, suppliedResult.error);
  assert.match(suppliedResult.event, /return to the workshop to take and install the fuse/i);
  assert.doesNotMatch(suppliedResult.event, /take the lantern and oil/i);
});
