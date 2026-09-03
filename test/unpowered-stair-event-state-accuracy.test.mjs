import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("unpowered stair feedback reflects an already wound chronometer", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 880002, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "take_oil",
  ]).state;

  const climbed = step(world, keeper, "climb_tower");
  assert.equal(climbed.ok, true, climbed.error);
  assert.match(climbed.event, /chronometer already wound/i);
  assert.doesNotMatch(climbed.event, /wind it before this early fill/i);
});

test("unpowered stair feedback reflects a consumed repair return", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 880001, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "take_oil",
    "climb_tower",
    "return_keeper_after_fill",
  ]).state;

  assert.equal(keeper.flags.includes("tower_return_used"), true);
  assert.equal(legalActions(world, keeper).includes("wind_chronometer"), false);
  const climbed = step(world, keeper, "climb_tower");
  assert.equal(climbed.ok, true, climbed.error);
  assert.match(climbed.event, /early chronometer timing is no longer available/i);
  assert.doesNotMatch(climbed.event, /wind it before this early fill/i);
});
