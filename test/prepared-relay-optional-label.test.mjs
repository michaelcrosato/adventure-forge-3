import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("a ready sheltered finish makes the tower relay visibly optional", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 575, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
    "close_storm_shutters",
  ]).state;
  const view = observation(world, tower);
  const input = modelTurnInput(world, view);
  const relayIndex = view.actions.findIndex(([id]) => id === "check_tower_radio");
  const relay = input.a.find(([index]) => index === relayIndex);

  assert.equal(legalActions(world, tower).includes("check_tower_radio"), true);
  assert.equal(view.actions.some(([id]) => id === "light_sheltered_chronometer_beacon"), true);
  assert.ok(relay);
  assert.equal(relay[1], "Optional relay check (costs one turn); a sheltered beacon finish is ready");
  assert.doesNotMatch(relay[1], /before last turn|never on last turn|finish beam tuning/i);
});
