import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("full preparation earns a dedicated boat-and-beam finish", async () => {
  const world = await loadWorld();
  const prepared = replayActions(world, 239, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "take_oil",
    "read_log",
    "study_tide_chart",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;

  assert.equal(legalActions(world, prepared).includes("light_aligned_trimmed_beacon"), false);
  assert.equal(legalActions(world, prepared).includes("light_all_ready_beacon"), true);
  const ending = step(world, prepared, "light_all_ready_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, prepared.score + 7);
});
