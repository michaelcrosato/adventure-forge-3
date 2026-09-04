import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("chronometer rescue endings name timing instead of an unchecked channel", async () => {
  const world = await loadWorld();
  const ending = replayActions(world, 246, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "read_log",
    "study_tide_chart",
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
    "light_chronometer_beacon",
  ]).observation.end[2];

  assert.match(ending, /tuned beam and chronometer timing earn the strongest rescue/i);
  assert.doesNotMatch(ending, /tuned channel/i);
});
