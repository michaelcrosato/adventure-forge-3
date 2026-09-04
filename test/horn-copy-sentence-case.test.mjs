import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("post-horn tower guidance follows the punctuation before its timing clause", async () => {
  const world = await loadWorld();
  const postPeriod = replayActions(world, 1, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "wait_for_horn",
  ]).state;
  const postSemicolon = replayActions(world, 2, [
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
    "wait_for_horn",
  ]).state;
  const periodText = observation(world, postPeriod).text;
  const semicolonText = observation(world, postSemicolon).text;

  assert.match(periodText, /\. Horn timing is recorded; finish the remaining beam tuning before lighting\./);
  assert.doesNotMatch(periodText, /\. horn timing is recorded;/);
  assert.match(semicolonText, /; horn timing is recorded; finish the remaining beam tuning before lighting\./);
  assert.doesNotMatch(semicolonText, /; Horn timing is recorded;/);
});
