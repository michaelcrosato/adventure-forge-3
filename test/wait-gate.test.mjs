import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("waiting for the horn opens after the boat is signaled and the lantern is filled", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 379, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  assert.equal(tower.flags.includes("boat_signaled"), true);
  assert.equal(tower.flags.includes("radio_checked"), false);
  assert.equal(legalActions(world, tower).includes("wait_for_horn"), true);
});
