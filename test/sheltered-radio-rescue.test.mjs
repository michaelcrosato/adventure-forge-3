import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("radio confirmation and shutters combine into the strongest rescue", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 971, [
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
    "check_tower_radio",
  ]).state;

  const actions = legalActions(world, tower);
  assert.equal(actions.includes("light_sheltered_radio_beacon"), true);
  assert.equal(actions.includes("light_radio_rescue_beacon"), false);

  const ending = step(world, tower, "light_sheltered_radio_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, tower.score + 12);
});
