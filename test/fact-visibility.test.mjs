import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the bounded model view keeps every reachable durable clue", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 937, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
    "close_storm_shutters",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.journal.length, 14);
  assert.deepEqual(view.facts, state.journal);
  assert.deepEqual(input.facts, state.journal);
  assert.ok(input.facts.includes("Tower current restored."));
  assert.ok(input.facts.includes("You waited through one boat horn."));
});
