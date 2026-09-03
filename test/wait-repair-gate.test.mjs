import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("waiting for the horn stays closed until tower current is restored", async () => {
  const world = await loadWorld();
  const beforeRepair = replayActions(world, 401, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "fill_lantern",
  ]).state;

  assert.equal(beforeRepair.flags.includes("fuse_installed"), false);
  assert.equal(legalActions(world, beforeRepair).includes("wait_for_horn"), false);

  const repaired = replayActions(world, 401, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;

  assert.equal(repaired.flags.includes("fuse_installed"), true);
  assert.equal(legalActions(world, repaired).includes("wait_for_horn"), true);
});
