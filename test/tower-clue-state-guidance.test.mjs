import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the tower observation reports missing log and tide clues accurately", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 6201, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const text = observation(world, tower).text;

  assert.equal(tower.room, "tower");
  assert.match(text, /wall log and tide chart are pending/i);
  assert.doesNotMatch(text, /log and tide chart are recorded/i);
});
