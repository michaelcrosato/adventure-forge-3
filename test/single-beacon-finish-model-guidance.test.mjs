import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the bounded tower input singularizes a lone non-final beacon finish", async () => {
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
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.turn, 16);
  assert.deepEqual(legalActions(world, state), ["light_radio_rescue_beacon"]);
  assert.match(view.text, /several lighting choices/i);
  assert.match(input.text, /one beacon finish remains; light when ready/i);
  assert.doesNotMatch(input.text, /several lighting choices/i);
});
