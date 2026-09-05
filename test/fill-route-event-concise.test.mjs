import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("route-specific lantern-fill feedback stays compact", async () => {
  const world = await loadWorld();
  const chronometerTower = replayActions(world, 268, [
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
  ]).state;
  const timedFill = step(world, chronometerTower, "fill_lantern");
  const timedInput = modelTurnInput(world, observation(world, timedFill.state, timedFill.event));

  assert.ok(timedFill.event.length < 270, `timed fill feedback is ${timedFill.event.length} characters`);
  assert.ok(timedInput.last.length < 270, `timed model event is ${timedInput.last.length} characters`);

  const confirmedTower = replayActions(world, 301, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const confirmedFill = step(world, confirmedTower, "fill_lantern");

  assert.ok(confirmedFill.event.length < 220, `confirmed fill feedback is ${confirmedFill.event.length} characters`);
  assert.match(confirmedFill.event, /confirmed-channel route is the strongest rescue/i);
  assert.match(confirmedFill.event, /horn timing is an optional bonus/i);
});
