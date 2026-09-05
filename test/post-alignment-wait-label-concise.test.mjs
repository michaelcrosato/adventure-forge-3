import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("post-alignment horn feedback leaves the timing choice open", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 100029, [
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
  const view = observation(world, state, "Beam will hold true.");
  const input = modelTurnInput(world, view);
  const wait = view.actions.find(([id]) => id === "wait_for_horn");
  const waitIndex = view.actions.findIndex(([id]) => id === "wait_for_horn");

  assert.ok(wait);
  assert.equal(wait[1], "Wait for the horn for an optional timing bonus");
  assert.equal(input.a[waitIndex][1], "Wait for the horn for an optional timing bonus");
});
