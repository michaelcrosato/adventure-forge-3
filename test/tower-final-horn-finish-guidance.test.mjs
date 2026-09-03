import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("a final horn-waited turn prioritizes lighting over remaining tuning", async () => {
  const world = await loadWorld();
  const late = replayActions(world, 107, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "return_keeper_after_fill",
    "read_log",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "go_workshop",
    "return_keeper_from_workshop",
    "study_tide_chart",
    "signal_boat",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "trim_wick",
    "wait_for_horn",
  ]).state;

  assert.equal(late.turn, world.maxTurns - 1);
  assert.deepEqual(legalActions(world, late), ["light_trimmed_beacon", "align_lens"]);

  const text = observation(world, late).text;

  assert.match(text, /light the available rescue beacon now; remaining tuning is optional/i);
  assert.doesNotMatch(text, /finish the remaining beam tuning before lighting/i);
});
