import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a secured but unsignaled boat gets a dedicated beacon finish", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 983, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const actions = legalActions(world, tower);

  assert.equal(actions.includes("light_beacon"), false);
  assert.equal(actions.includes("light_moored_beacon"), true);

  const ending = step(world, tower, "light_moored_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, tower.score + 6);
});
