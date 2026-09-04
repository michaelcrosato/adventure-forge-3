import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("bounded confirmed-channel wait label separates the bonus from the finish", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 9407, [
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
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;
  const view = observation(world, state);
  const rawIndex = view.actions.findIndex(([id]) => id === "wait_for_horn");
  const input = modelTurnInput(world, view);

  assert.ok(rawIndex >= 0);
  assert.doesNotMatch(view.actions[rawIndex][1], /confirmed-channel finish stays the same/i);
  assert.match(input.a[rawIndex][1], /confirmed-channel finish stays the same, with a timing bonus added/i);
});
