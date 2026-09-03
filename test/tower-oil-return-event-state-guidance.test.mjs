import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("tower oil recovery event omits the already-carried lantern", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 6042, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;

  const returned = step(world, tower, "return_keeper_from_tower");

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /return for missing oil.*collect it before returning to the tower/i);
  assert.doesNotMatch(returned.event, /if the lantern is missing too|collect both/i);
});
