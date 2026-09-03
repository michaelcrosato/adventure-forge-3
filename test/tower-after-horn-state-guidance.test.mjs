import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the tower observation stops repeating the spent horn wait", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 9301, [
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
    "wait_for_horn",
  ]).state;
  const text = observation(world, tower).text;

  assert.equal(legalActions(world, tower).includes("wait_for_horn"), false);
  assert.match(text, /horn timing is recorded; finish the remaining beam tuning before lighting/i);
  assert.doesNotMatch(text, /before spending a turn to wait/i);
});
