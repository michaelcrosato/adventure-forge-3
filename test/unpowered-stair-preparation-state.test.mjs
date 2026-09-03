import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("an early climb names missing preparation before the chronometer", async () => {
  const world = await loadWorld();
  const early = replayActions(world, 6801, [
    "take_lantern",
    "enter_house",
    "take_oil",
  ]).state;
  const climbed = step(world, early, "climb_tower");

  assert.equal(climbed.ok, true, climbed.error);
  assert.match(
    climbed.event,
    /after filling, return to read the wall log, study the tide chart, secure and signal the boat, wind the chronometer/i,
  );
  assert.doesNotMatch(climbed.event, /wind it before this early fill/i);
});

test("an early climb with a confirmed channel does not suggest chronometer prep", async () => {
  const world = await loadWorld();
  const prepared = replayActions(world, 6802, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const climbed = step(world, prepared, "climb_tower");

  assert.equal(climbed.ok, true, climbed.error);
  assert.match(climbed.event, /confirmed channel is already prepared/i);
  assert.doesNotMatch(climbed.event, /chronometer/i);
  assert.doesNotMatch(climbed.event, /wind it before this early fill/i);
});
