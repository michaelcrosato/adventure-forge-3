import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a marked tide gets its own secured-boat finish", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 1003, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "study_tide_chart",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const actions = legalActions(world, tower);

  assert.equal(actions.includes("light_moored_beacon"), false);
  assert.equal(actions.includes("light_moored_tide_beacon"), true);
  assert.equal(actions.includes("light_moored_aligned_trimmed_beacon"), false);

  const ending = step(world, tower, "light_moored_tide_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, tower.score + 7);
});
