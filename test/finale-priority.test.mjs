import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the strongest prepared finale is the only advanced finish offered", async () => {
  const world = await loadWorld();
  const prepared = replayActions(world, 241, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;
  const legal = legalActions(world, prepared);

  assert.equal(legal.includes("light_all_ready_beacon"), false);
  assert.equal(legal.includes("light_timed_beacon"), false);
  assert.equal(legal.includes("light_rescue_beacon"), false);
  assert.equal(legal.includes("light_radio_rescue_beacon"), true);
});
