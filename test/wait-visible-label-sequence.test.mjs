import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the visible horn-wait label gives a clear pre-deadline sequence", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 423019, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;

  const wait = observation(world, tower).actions.find(([id]) => id === "wait_for_horn");
  assert.ok(wait);
  assert.match(wait[1], /wait for the horn.*costs one turn.*light next turn/i);
  assert.doesNotMatch(wait[1], /one turn remaining: light now/i);
});
