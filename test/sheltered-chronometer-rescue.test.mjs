import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("barred shutters upgrade the horn-synced chronometer rescue", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 919, [
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
  const shuttered = step(world, tower, "close_storm_shutters");
  assert.equal(shuttered.ok, true, shuttered.error);
  assert.equal(shuttered.state.flags.includes("shutters_closed"), true);
  assert.equal(shuttered.state.score, tower.score + 1);
  assert.ok(shuttered.state.journal.includes("Storm shutters barred for a steady beam."));
  assert.equal(legalActions(world, shuttered.state).includes("light_chronometer_beacon"), false);
  assert.equal(
    legalActions(world, shuttered.state).includes("light_sheltered_chronometer_beacon"),
    true,
  );

  const ending = step(world, shuttered.state, "light_sheltered_chronometer_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, shuttered.state.score + 11);
});
