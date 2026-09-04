import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("confirmed-channel trim feedback keeps only the live beam choices", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 100004, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  const trimmed = step(world, tower, "trim_wick");

  assert.equal(trimmed.ok, true, trimmed.error);
  assert.doesNotMatch(trimmed.event, /route remains the strongest rescue/i);
  assert.match(trimmed.event, /align the beacon lens.*optional beam upgrade/i);
  assert.match(trimmed.event, /light the trimmed beacon now/i);
});
