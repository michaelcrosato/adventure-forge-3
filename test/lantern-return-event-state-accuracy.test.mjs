import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("missing-lantern recovery feedback names its immediate destination", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 6701, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const returned = step(world, tower, "return_keeper_for_lantern");

  assert.equal(returned.ok, true, returned.error);
  assert.equal(returned.state.room, "keeper_room");
  assert.match(returned.event, /descend to the keeper's room.*go to the jetty.*missing lantern/i);
  assert.match(returned.event, /take oil before returning to the repaired stair/i);
  assert.doesNotMatch(returned.event, /^Return to the jetty/i);
});
