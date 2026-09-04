import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("model wait label explains what the horn bonus changes", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 527018, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
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
  const input = modelTurnInput(world, view);
  const rawWait = view.actions.find(([id]) => id === "wait_for_horn");
  const modelWait = input.a.find(([index]) => view.actions[index][0] === "wait_for_horn");

  assert.ok(rawWait);
  assert.ok(modelWait);
  assert.match(rawWait[1], /horn's timing bonus strengthens the rescue/i);
  assert.match(modelWait[1], /horn's timing bonus strengthens the rescue/i);
});
