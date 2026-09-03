import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("the repaired workshop opens a direct service ladder to the tower", async () => {
  const world = await loadWorld();
  const repaired = replayActions(world, 13, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;

  assert.equal(legalActions(world, repaired).includes("climb_service_ladder"), true);
  const tower = step(world, repaired, "climb_service_ladder");
  assert.equal(tower.ok, true, tower.error);
  assert.equal(tower.state.room, "tower");

  const filled = step(world, tower.state, "fill_lantern");
  assert.equal(filled.ok, true, filled.error);
  const ending = step(world, filled.state, "light_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
});
