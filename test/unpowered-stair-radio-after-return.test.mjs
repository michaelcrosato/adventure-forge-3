import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("an early climb keeps confirmed-channel guidance after a repair return", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 903001, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "climb_tower",
    "return_keeper_after_fill",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const climbed = step(world, keeper, "climb_tower");

  assert.equal(keeper.flags.includes("radio_checked"), true);
  assert.equal(keeper.flags.includes("tower_return_used"), true);
  assert.equal(climbed.ok, true, climbed.error);
  assert.match(climbed.event, /confirmed channel is already prepared/i);
  assert.doesNotMatch(climbed.event, /early chronometer timing is no longer available/i);
});
