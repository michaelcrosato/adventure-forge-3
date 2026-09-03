import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the tower relay appears before finishes it can improve", async () => {
  const world = await loadWorld();
  const prepared = replayActions(world, 503, [
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
    "trim_wick",
    "align_lens",
  ]).state;
  const actions = legalActions(world, prepared);

  assert.ok(actions.indexOf("check_tower_radio") < actions.indexOf("light_rescue_beacon"));
  assert.ok(actions.indexOf("check_tower_radio") < actions.indexOf("light_all_ready_beacon"));
});
