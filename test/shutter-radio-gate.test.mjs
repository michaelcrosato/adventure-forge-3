import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("radio confirmation closes the incompatible shutter preparation", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 947, [
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
  ]).state;

  assert.equal(legalActions(world, tower).includes("close_storm_shutters"), true);
  const checked = step(world, tower, "check_tower_radio");
  assert.equal(checked.ok, true, checked.error);
  assert.equal(checked.state.flags.includes("radio_checked"), true);
  assert.equal(legalActions(world, checked.state).includes("close_storm_shutters"), false);
  assert.equal(legalActions(world, checked.state).includes("light_radio_rescue_beacon"), true);
});
