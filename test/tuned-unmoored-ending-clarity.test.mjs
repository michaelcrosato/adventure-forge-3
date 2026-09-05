import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("a tuned direct ending names the rescue and unsecured boat status", async () => {
  const world = await loadWorld();
  const ending = replayActions(world, 85001, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "return_for_mooring",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "light_aligned_trimmed_beacon",
  ]).observation.end[2];

  assert.match(ending, /tuned direct rescue succeeds/i);
  assert.match(ending, /mooring was not secured.*not guaranteed to hold/i);
  assert.doesNotMatch(ending, /optional preparation earns a stronger rescue\.$/i);
});
