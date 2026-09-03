import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("the tide window leaves a final turn after last-minute beam tuning", async () => {
  const world = await loadWorld();
  const tuned = replayActions(world, 5997, [
    "enter_house",
    "read_log",
    "go_jetty",
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "study_tide_chart",
    "take_oil",
    "climb_tower",
    "return_keeper_after_fill",
    "signal_boat",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "return_keeper_from_workshop",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "align_lens",
    "trim_wick",
  ]).state;

  assert.equal(tuned.turn, 23);
  assert.equal(tuned.ended, false);
  assert.equal(legalActions(world, tuned).includes("light_radio_rescue_beacon"), true);
  const ending = step(world, tuned, "light_radio_rescue_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
});
