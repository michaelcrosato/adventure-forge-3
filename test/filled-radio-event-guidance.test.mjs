import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("filled-lantern clue events stop prescribing pre-oil radio timing", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7302, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "read_log",
  ]).state;

  const signaled = step(world, keeper, "signal_boat");
  const tide = step(world, signaled.state, "study_tide_chart");

  assert.equal(signaled.ok, true, signaled.error);
  assert.equal(tide.ok, true, tide.error);
  assert.doesNotMatch(signaled.event, /before taking oil/i);
  assert.doesNotMatch(tide.event, /before taking oil/i);
  assert.match(tide.event, /check it if time allows/i);
});
