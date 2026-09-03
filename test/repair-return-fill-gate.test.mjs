import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("a filled lantern suppresses the emergency missing-oil return", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 283, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;

  assert.equal(workshop.flags.includes("lantern_filled"), true);
  assert.equal(workshop.flags.includes("fuse_installed"), true);
  assert.equal(legalActions(world, workshop).includes("return_keeper_after_repair"), false);
});
