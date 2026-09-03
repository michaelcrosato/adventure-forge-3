import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("closing storm shutters on the final turn warns that lighting is too late", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 4321, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "climb_repaired_stairs",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
  ]).state;

  assert.equal(tower.turn, world.maxTurns - 1);
  assert.equal(legalActions(world, tower).includes("close_storm_shutters"), true);

  const closed = step(world, tower, "close_storm_shutters");

  assert.equal(closed.ok, true, closed.error);
  assert.equal(closed.state.ending, "timeout");
  assert.match(closed.event, /no turn remains to light the beacon/i);
  assert.doesNotMatch(closed.event, /sheltered finish is ready/i);
});
