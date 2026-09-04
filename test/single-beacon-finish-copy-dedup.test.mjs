import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("a lone non-final beacon finish does not repeat its light cue", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 92001, [
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
    "wait_for_horn",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));

  assert.equal(state.turn, 16);
  assert.deepEqual(legalActions(world, state), ["light_radio_rescue_beacon"]);
  assert.match(input.text, /one beacon finish remains; light when ready/i);
  assert.doesNotMatch(input.text, /before the final turn: light when ready; remaining preparation is optional/i);
});
