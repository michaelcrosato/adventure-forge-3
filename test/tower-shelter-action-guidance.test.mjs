import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the model input does not advertise shutters before that action is available", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 45, [
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

  assert.equal(state.room, "tower");
  assert.equal(view.actions.some(([id]) => id === "close_storm_shutters"), false);
  assert.match(view.text, /bar shutters: sheltered finish/i);
  assert.match(input.text, /sheltered finish unavailable yet/i);
  assert.doesNotMatch(input.text, /bar shutters: sheltered finish/i);
});
