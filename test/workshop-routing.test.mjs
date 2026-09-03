import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the workshop remains available for missing supplies but closes when ready", async () => {
  const world = await loadWorld();
  const missingLantern = replayActions(world, 269, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "take_oil",
  ]).state;
  assert.equal(legalActions(world, missingLantern).includes("go_workshop"), true);

  const supplied = replayActions(world, 271, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "take_oil",
  ]).state;
  assert.equal(legalActions(world, supplied).includes("go_workshop"), false);
});
