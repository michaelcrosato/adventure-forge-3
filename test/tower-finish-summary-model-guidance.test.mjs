import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the pre-finish tower model input does not advertise unavailable lighting choices", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 44, [
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
  assert.deepEqual(view.actions, [["fill_lantern", world.actions.fill_lantern.label]]);
  assert.match(view.text, /several lighting choices/i);
  assert.match(input.text, /no beacon finish is available yet/i);
  assert.doesNotMatch(input.text, /several lighting choices/i);
});
