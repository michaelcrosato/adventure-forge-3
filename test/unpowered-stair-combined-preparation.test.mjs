import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("an early climb prioritizes a confirmed channel over chronometer timing", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 901101, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const climbed = step(world, keeper, "climb_tower");

  assert.equal(keeper.flags.includes("chronometer_wound"), true);
  assert.equal(keeper.flags.includes("radio_checked"), true);
  assert.equal(climbed.ok, true, climbed.error);
  assert.match(climbed.event, /confirmed channel is already prepared/i);
  assert.doesNotMatch(climbed.event, /chronometer already wound/i);
});
