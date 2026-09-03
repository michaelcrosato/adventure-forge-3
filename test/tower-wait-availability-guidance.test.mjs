import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the tower drops horn-wait advice before that action is available", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 7226, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const text = observation(world, tower).text;

  assert.equal(legalActions(world, tower).includes("wait_for_horn"), false);
  assert.match(text, /finish any trim or alignment before lighting/i);
  assert.doesNotMatch(text, /before spending a turn to wait/i);
});
