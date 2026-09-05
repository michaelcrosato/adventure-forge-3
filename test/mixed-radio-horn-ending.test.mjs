import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("a horn-waited radio rescue keeps a mixed route ending atmospheric", async () => {
  const world = await loadWorld();
  const ending = replayActions(world, 935001, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "check_tower_radio",
    "wait_for_horn",
    "light_radio_rescue_beacon",
  ]).observation.end[2];

  assert.equal(ending, "The beacon burns through the rain. The island has a keeper again. The clear channel carries the horn's call; the boat answers through the rain.");
  assert.doesNotMatch(ending, /channel selects the route|optional bonus|strongest rescue/i);
});
