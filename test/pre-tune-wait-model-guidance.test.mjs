import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("pre-tuning wait guidance gives the horn turn a clear sequence", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 249, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);
  const waitIndex = view.actions.findIndex(([id]) => id === "wait_for_horn");

  assert.ok(waitIndex >= 0);
  assert.match(input.a[waitIndex][1], /wait for the horn; tune after the wait, then light once tuning is complete/i);
  assert.match(input.a[waitIndex][1], /do not wait on the final turn/i);
  assert.doesNotMatch(input.a[waitIndex][1], /light next turn/i);
  assert.match(view.actions[waitIndex][1], /light next turn/i);
});
