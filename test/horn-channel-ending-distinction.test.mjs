import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the confirmed-channel ending separates route selection from the horn bonus", async () => {
  const world = await loadWorld();
  const ending = replayActions(world, 26004, [
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
    "wait_for_horn",
    "light_radio_rescue_beacon",
  ]).observation.end[2];

  assert.match(ending, /channel selects the route; the horn adds only its bonus/i);
});
