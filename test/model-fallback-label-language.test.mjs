import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("model fallback label explains the optional horn bonus", async () => {
  const world = await loadWorld();
  const route = [
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
  ];
  const state = replayActions(world, 505018, route).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);
  const rawAction = view.actions.find(([id]) => id === "light_all_ready_beacon");
  const modelAction = input.a.find(([index]) => view.actions[index][0] === "light_all_ready_beacon");

  assert.ok(rawAction);
  assert.ok(modelAction);
  assert.match(rawAction[1], /valid fallback rescue.*wait for horn bonus/i);
  assert.match(modelAction[1], /horn bonus is optional.*tuned channel.*stronger rescue/i);
  assert.doesNotMatch(modelAction[1], /fallback|no marked tide|without timing bonus/i);
});
