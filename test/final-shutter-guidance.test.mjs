import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("final-turn shutter copy prioritizes an available beacon over tuning guidance", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 1, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "trim_wick",
    "wait_for_horn",
    "close_storm_shutters",
    "check_tower_radio",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.turn, world.maxTurns - 1);
  assert.deepEqual(view.actions, [["light_trimmed_beacon", world.actions.light_trimmed_beacon.label]]);
  assert.match(view.text, /shutters barred; sheltered finish is too late; light now/i);
  assert.doesNotMatch(view.text, /finish remaining trim or alignment before lighting/i);
  assert.match(input.text, /shutters barred; sheltered finish is too late; light now/i);
  assert.doesNotMatch(input.text, /finish remaining trim or alignment before lighting/i);
});

test("final-turn shutter copy admits when no rescue remains", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 2, [
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
    "check_storm_radio",
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
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.turn, world.maxTurns - 1);
  assert.equal(legalActions(world, state).includes("leave_island"), true);
  assert.deepEqual(view.actions, [["leave_island", world.actions.leave_island.label]]);
  assert.match(view.text, /shutters barred; no rescue remains; leave if possible/i);
  assert.doesNotMatch(view.text, /finish remaining trim or alignment before lighting/i);
  assert.match(input.text, /shutters barred; no rescue remains; leave if possible/i);
  assert.doesNotMatch(input.text, /finish remaining trim or alignment before lighting/i);
});
