import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("confirmed-channel fill event keeps only the optional tuning cue", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 9403, [
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
  const filled = step(world, tower, "fill_lantern");
  const input = modelTurnInput(world, observation(world, filled.state, filled.event));

  assert.equal(input.last, "Lantern filled; optional beam tuning remains before lighting.");
  assert.doesNotMatch(input.last, /trim the wick or align the lens|do both for the strongest/i);
  assert.match(input.text, /finish any trim or alignment before spending a turn to wait/i);
});
