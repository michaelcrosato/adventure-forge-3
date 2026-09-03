import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the missing-lantern recovery menu names its purpose", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 1601, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
  ]).state;

  assert.equal(legalActions(world, keeper).includes("go_jetty"), true);
  assert.match(world.actions.go_jetty.label, /missing lantern/i);
});
