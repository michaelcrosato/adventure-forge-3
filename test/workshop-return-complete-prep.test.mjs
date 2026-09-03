import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the repaired workshop backtrack skips prep guidance when keeper work is complete", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 905201, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "check_storm_radio",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const returned = step(world, workshop, "return_keeper_from_workshop");

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /current is already restored.*then use the repaired stair/i);
  assert.doesNotMatch(returned.event, /finish any keeper-room prep/i);
});
