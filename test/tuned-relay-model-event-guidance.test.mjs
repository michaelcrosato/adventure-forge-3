import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("tuned relay model input drops the spent beam cue", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 21001, [
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
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(replayed.observation.event, /finish beam tuning if needed/i);
  assert.match(input.last, /beam tuning is complete.*use confirmed-channel rescue beacon/i);
  assert.doesNotMatch(input.last, /finish beam tuning if needed/i);
});
