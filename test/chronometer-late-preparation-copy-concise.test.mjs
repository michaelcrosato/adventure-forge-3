import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("late chronometer preparation leaves optional choices discoverable", async () => {
  const world = await loadWorld();
  const filled = replayActions(world, 100012, [
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
  ]).state;

  const beforeTrim = observation(world, filled);
  const trimLabel = beforeTrim.actions.find(([id]) => id === "trim_wick");
  assert.ok(trimLabel);
  assert.equal(trimLabel[1], "Trim the wick for a cleaner beam");

  const trimmed = step(world, filled, "trim_wick");
  assert.equal(trimmed.ok, true, trimmed.error);
  assert.equal(
    trimmed.event,
    "Clean, steady flame; lens remains unaligned. The remaining beam adjustment is optional before lighting.",
  );
  assert.doesNotMatch(trimmed.event, /wait for the horn|chronometer-timed finish/i);

  const afterWait = replayActions(world, 100012, [
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
  const shutter = observation(world, afterWait).actions.find(([id]) => id === "close_storm_shutters");

  assert.equal(legalActions(world, afterWait).includes("close_storm_shutters"), true);
  assert.ok(shutter);
  assert.equal(
    shutter[1],
    "Optional: close storm shutters for a sheltered finish (costs one turn; beam tuning is complete)",
  );
  assert.doesNotMatch(shutter[1], /never on last turn/i);
});
