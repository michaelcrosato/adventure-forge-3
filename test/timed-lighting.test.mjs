import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("the tide chart unlocks a perfectly timed full-preparation finish", async () => {
  const world = await loadWorld();
  const prepared = replayActions(world, 227, [
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
  ]).state;

  assert.equal(legalActions(world, prepared).includes("light_timed_beacon"), true);
  const ending = step(world, prepared, "light_timed_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, prepared.score + 8);
});
