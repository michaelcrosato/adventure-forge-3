import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("late tuned relay label presents channel confirmation as optional", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 701004, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;
  const relay = observation(world, tower).actions.find(([id]) => id === "check_tower_radio");

  assert.equal(tower.turn, world.maxTurns - 7);
  assert.ok(relay);
  assert.equal(relay[1], "Optional relay check to confirm the channel (costs one turn)");
  assert.doesNotMatch(relay[1], /beam tuning is complete/i);
});
