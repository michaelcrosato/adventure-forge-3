import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("waiting on a marked tide unlocks the horn-timed finale", async () => {
  const world = await loadWorld();
  const tuned = replayActions(world, 691, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "study_tide_chart",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
  ]).state;

  const legal = legalActions(world, tuned);
  assert.equal(legal.includes("light_horn_timed_beacon"), true);
  assert.equal(legal.includes("light_timed_beacon"), false);
  assert.equal(legal.includes("light_all_ready_beacon"), false);

  const ending = step(world, tuned, "light_horn_timed_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, tuned.score + 8);
});
