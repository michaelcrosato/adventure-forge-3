import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the finale menu lists the stronger advanced finish first", async () => {
  const world = await loadWorld();
  const timed = replayActions(world, 457, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
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
  const timedActions = legalActions(world, timed);

  assert.ok(timedActions.indexOf("light_timed_beacon") < timedActions.indexOf("light_all_ready_beacon"));

  const rescue = replayActions(world, 461, [
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
  const rescueActions = legalActions(world, rescue);

  assert.ok(
    rescueActions.indexOf("light_rescue_beacon") < rescueActions.indexOf("light_all_ready_beacon"),
  );
});
