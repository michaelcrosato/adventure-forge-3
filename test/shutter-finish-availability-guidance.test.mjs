import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("barred shutters do not promise a finish before beam tuning is complete", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 6, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "wait_for_horn",
    "close_storm_shutters",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.flags.includes("shutters_closed"), true);
  assert.equal(
    legalActions(world, state).some((id) => id.startsWith("light_sheltered")),
    false,
  );
  assert.match(view.text, /shutters barred; finish remaining trim or alignment before lighting/i);
  assert.match(input.text, /shutters barred; finish remaining trim or alignment before lighting/i);
  assert.doesNotMatch(input.text, /sheltered finish ready/i);
});
