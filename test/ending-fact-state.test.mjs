import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("a beacon ending retires the stale dark-beacon fact", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 78002, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const ending = step(world, tower, "light_beacon");

  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.journal.includes("Hand lantern filled; beacon remains dark."), false);
});
