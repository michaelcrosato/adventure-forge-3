import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("a tuned chronometer wait does not repeat route instructions", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 100010, [
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

  const waited = step(world, tower, "wait_for_horn");

  assert.equal(waited.ok, true, waited.error);
  assert.equal(waited.event, "Horn timing recorded; beam tuning is complete.");
  assert.equal(legalActions(world, waited.state).includes("light_chronometer_beacon"), true);

  const input = modelTurnInput(world, observation(world, waited.state, waited.event));
  assert.equal(input.last, "Horn timing recorded; beam tuning is complete.");
  assert.doesNotMatch(input.last, /chronometer-timed finish|light next turn|never wait/i);
});
