import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("barred shutters model input drops the spent shelter event", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 20001, [
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

  assert.match(replayed.observation.event, /bar storm shutters before this check if needed/i);
  assert.match(input.last, /channel is clear.*costs a turn/i);
  assert.doesNotMatch(input.last, /bar storm shutters before this check/i);
});
