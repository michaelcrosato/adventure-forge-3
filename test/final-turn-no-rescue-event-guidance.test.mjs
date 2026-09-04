import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("the bounded final-turn event stops promising a finish after rescue is gone", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 7401, [
    "enter_house",
    "read_log",
    "study_tide_chart",
    "go_jetty",
    "take_lantern",
    "enter_house",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
    "wait_for_horn",
    "close_storm_shutters",
    "check_tower_radio",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.equal(replayed.state.turn, world.maxTurns - 1);
  assert.deepEqual(replayed.observation.actions, [["leave_island", world.actions.leave_island.label]]);
  assert.match(replayed.observation.event, /confirmed-channel rescue beacon/i);
  assert.match(input.last, /no beacon finish remains; leave if possible/i);
  assert.doesNotMatch(input.last, /finish beam tuning|confirmed-channel rescue beacon|sheltered finish/i);
});
