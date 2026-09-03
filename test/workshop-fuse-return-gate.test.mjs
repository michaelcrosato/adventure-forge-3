import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the workshop keeps a carried fuse pointed at installation", async () => {
  const world = await loadWorld();
  const carrying = replayActions(world, 61, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
  ]).state;

  assert.equal(legalActions(world, carrying).includes("return_keeper_from_workshop"), false);
  assert.equal(legalActions(world, carrying).includes("install_fuse"), true);
});
