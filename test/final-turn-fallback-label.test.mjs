import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the final-turn fallback label closes the unavailable horn-wait option", async () => {
  const world = await loadWorld();
  const late = replayActions(world, 107, [
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
    "go_jetty",
    "take_lantern",
    "enter_house",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "climb_repaired_stairs",
    "trim_wick",
    "align_lens",
  ]).state;

  const view = observation(world, late);
  const input = modelTurnInput(world, view);
  const fallback = view.actions.find(([id]) => id === "light_all_ready_beacon");
  const modelFallback = input.a.find(([index]) => view.actions[index][0] === "light_all_ready_beacon");

  assert.equal(late.turn, world.maxTurns - 1);
  assert.ok(fallback, "expected the final-turn fallback action");
  assert.ok(modelFallback, "expected the fallback action in model input");
  assert.match(fallback[1], /without timing bonus.*wait for horn bonus when available/i);
  assert.match(modelFallback[1], /light the tuned beacon now; no time remains for the horn bonus/i);
  assert.doesNotMatch(modelFallback[1], /wait for horn bonus when available/i);
});
