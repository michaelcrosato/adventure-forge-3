import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("the confirmed-channel fallback remains available in the last turn", async () => {
  const world = await loadWorld();
  const late = replayActions(world, 2381, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "climb_repaired_stairs",
    "trim_wick",
    "align_lens",
    "check_tower_radio",
  ]).state;

  assert.equal(late.turn, 23);
  assert.equal(legalActions(world, late).includes("light_radio_rescue_beacon"), true);
  const ending = step(world, late, "light_radio_rescue_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
});
