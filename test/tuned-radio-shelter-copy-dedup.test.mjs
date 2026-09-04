import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("tuned confirmed-channel input drops the spent sheltered-route reminder", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 9306, [
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
  ]).state;
  const input = modelTurnInput(world, observation(world, state));

  assert.match(input.text, /align the beacon lens|light the clean flame/i);
  assert.doesNotMatch(input.text, /sheltered finish is unavailable after radio confirmation/i);
  assert.doesNotMatch(input.text, /bar shutters: sheltered finish/i);
});
