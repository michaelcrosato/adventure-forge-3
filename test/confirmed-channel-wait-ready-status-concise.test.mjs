import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("confirmed-channel horn feedback does not repeat its ready status", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 100009, [
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

  const waited = step(world, tower, "wait_for_horn");

  assert.equal(waited.ok, true, waited.error);
  assert.doesNotMatch(waited.event, /confirmed channel is ready/i);
  assert.match(waited.event, /use the confirmed-channel finish after tuning/i);
  assert.match(waited.event, /light next turn.*never wait on the last turn/i);
});
