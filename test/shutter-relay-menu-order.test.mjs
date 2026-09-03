import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the shutter preparation precedes the relay check for shelter", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 2003, [
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
    "trim_wick",
    "align_lens",
    "wait_for_horn",
  ]).state;
  const actions = legalActions(world, tower);

  assert.ok(actions.indexOf("close_storm_shutters") < actions.indexOf("check_tower_radio"));
});
