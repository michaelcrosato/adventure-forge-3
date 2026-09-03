import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("horn wait names the confirmed-channel finish when radio is ready", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 100001, [
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
  ]).state;

  const waited = step(world, tower, "wait_for_horn");
  assert.equal(waited.ok, true, waited.error);
  assert.match(waited.event, /confirmed-channel finish after tuning/i);
  assert.doesNotMatch(waited.event, /marked-tide finish/i);
  const trimmed = step(world, waited.state, "trim_wick").state;
  const tuned = step(world, trimmed, "align_lens").state;
  assert.equal(legalActions(world, tuned).includes("light_radio_rescue_beacon"), true);
  assert.equal(legalActions(world, tuned).includes("light_rescue_beacon"), false);
});

test("horn wait names the chronometer finish when timing is ready", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 100002, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  const waited = step(world, tower, "wait_for_horn");
  assert.equal(waited.ok, true, waited.error);
  assert.match(waited.event, /chronometer-timed finish after tuning/i);
  assert.doesNotMatch(waited.event, /marked-tide finish/i);
  const trimmed = step(world, waited.state, "trim_wick").state;
  const tuned = step(world, trimmed, "align_lens").state;
  assert.equal(legalActions(world, tuned).includes("light_chronometer_beacon"), true);
  assert.equal(legalActions(world, tuned).includes("light_rescue_beacon"), false);
});
