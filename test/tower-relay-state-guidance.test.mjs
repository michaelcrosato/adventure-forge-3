import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the tower relay event treats tuning and shutters as conditional", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 2601, [
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

  assert.equal(replayed.state.flags.includes("shutters_closed"), true);
  assert.equal(replayed.state.flags.includes("radio_checked"), true);
  assert.match(replayed.observation.event, /finish beam tuning if needed/i);
  assert.match(replayed.observation.event, /bar storm shutters before this check if needed/i);
});
