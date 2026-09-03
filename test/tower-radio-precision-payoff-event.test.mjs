import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("tower relay feedback states the payoff on the chronometer route", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 572020, [
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

  const checked = step(world, tower, "check_tower_radio");

  assert.equal(checked.ok, true, checked.error);
  assert.match(checked.event, /confirmed channel earns the strongest rescue/i);
  assert.match(checked.event, /confirmed-channel rescue beacon/i);
  assert.ok(checked.event.length < 300);
});
