import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the tuned chronometer route retains a direct fallback before timing", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 901, [
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
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, state).includes("light_aligned_trimmed_beacon"), true);
  assert.equal(legalActions(world, state).includes("light_chronometer_beacon"), false);
  assert.equal(legalActions(world, state).includes("light_all_ready_beacon"), false);
  assert.equal(legalActions(world, state).includes("wait_for_horn"), true);
  assert.match(input.text, /beam tuning is complete; light now or wait for the horn/i);

  const fallback = replayActions(world, 901, [
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
    "light_aligned_trimmed_beacon",
  ]).state;
  assert.equal(fallback.ending, "beacon");
});
