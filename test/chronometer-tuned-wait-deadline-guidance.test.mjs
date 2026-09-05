import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("a tuned chronometer wait leaves the optional shutter turn clear", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 100011, [
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

  const beforeWait = observation(world, tower);
  const waitLabel = beforeWait.actions.find(([id]) => id === "wait_for_horn");
  assert.ok(waitLabel);
  assert.match(waitLabel[1], /optional preparation can still follow before lighting/i);
  assert.doesNotMatch(waitLabel[1], /light next turn/i);

  const waited = step(world, tower, "wait_for_horn");
  assert.equal(waited.ok, true, waited.error);
  assert.equal(waited.event, "Horn timing recorded; beam tuning is complete.");
  assert.doesNotMatch(waited.event, /light next turn|never wait on the last turn/i);
  assert.equal(legalActions(world, waited.state).includes("close_storm_shutters"), true);

  const sheltered = step(world, waited.state, "close_storm_shutters");
  assert.equal(sheltered.ok, true, sheltered.error);
  const ending = step(world, sheltered.state, "light_sheltered_chronometer_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
});
