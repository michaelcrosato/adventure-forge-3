import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("prepared rescue copy separates beam tuning from route and horn requirements", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 301, [
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
  ]).state;

  const filled = step(world, tower, "fill_lantern");
  assert.equal(filled.ok, true, filled.error);
  assert.match(filled.event, /beam tuning is optional/i);
  assert.match(filled.event, /confirmed-channel route is the strongest rescue/i);
  assert.match(filled.event, /horn timing is an optional bonus/i);

  const ending = replayActions(world, 301, [
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
  assert.match(ending, /tuned channel and horn timing earn the strongest rescue/i);
  assert.match(ending, /horn timing is an optional bonus, not required/i);
});
