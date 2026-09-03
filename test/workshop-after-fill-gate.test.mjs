import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("a filled repaired lantern keeps the workshop closed", async () => {
  const world = await loadWorld();
  const filledAndRepaired = replayActions(world, 521, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
  ]).state;

  assert.equal(filledAndRepaired.flags.includes("lantern_filled"), true);
  assert.equal(filledAndRepaired.flags.includes("fuse_installed"), true);
  assert.equal(legalActions(world, filledAndRepaired).includes("go_workshop"), false);

  const filledBeforeRepair = replayActions(world, 523, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;

  assert.equal(filledBeforeRepair.flags.includes("lantern_filled"), true);
  assert.equal(filledBeforeRepair.flags.includes("fuse_installed"), false);
  assert.equal(legalActions(world, filledBeforeRepair).includes("go_workshop"), true);
});
