import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("chronometer fill feedback keeps the confirmed-channel alternative visible", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 268, [
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
  const filled = step(world, tower, "fill_lantern");
  const input = modelTurnInput(world, observation(world, filled.state, filled.event));

  assert.equal(filled.ok, true, filled.error);
  assert.match(filled.event, /chronometer-timed route is the strongest rescue on this timing path/i);
  assert.match(filled.event, /confirmed-channel route is an equally strong alternative after a radio check/i);
  assert.match(filled.event, /horn timing is required only for the chronometer route/i);
  assert.match(input.last, /confirmed-channel route is an equally strong alternative after a radio check/i);
  assert.match(input.last, /without the required horn/i);
});
