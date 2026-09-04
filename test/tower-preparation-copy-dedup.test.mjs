import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("tower input does not repeat tuning before filling is available", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 42, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.deepEqual(legalActions(world, state), ["fill_lantern"]);
  assert.match(input.text, /no beacon finish is available yet; complete the available preparation before lighting/i);
  assert.doesNotMatch(input.text, /finish any trim or alignment before lighting/i);
});
