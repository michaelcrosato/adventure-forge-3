import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("fully tuned confirmed-channel wait label keeps only the timing choice", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 100007, [
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
  const view = observation(world, tower);
  const rawWait = view.actions.find(([id]) => id === "wait_for_horn");
  const modelWait = modelTurnInput(world, view).a.find(([index]) => view.actions[index][0] === "wait_for_horn");

  assert.ok(rawWait);
  assert.equal(rawWait[1], "Wait for the horn; timing bonus; costs one turn; light next turn");
  assert.ok(modelWait);
  assert.match(modelWait[1], /confirmed-channel finish stays the same, with a timing bonus added/i);
});
