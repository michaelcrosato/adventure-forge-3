import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the bounded radio label marks the before-oil check as optional", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 619020, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
  ]).state;
  const view = observation(world, state);
  const raw = view.actions.find(([id]) => id === "check_storm_radio");
  const input = modelTurnInput(world, view);
  const model = input.a.find(([index]) => view.actions[index][0] === "check_storm_radio");

  assert.ok(raw);
  assert.ok(model);
  assert.match(raw[1], /^Check the storm radio before taking oil \(costs one turn\)$/i);
  assert.equal(model[1], "Optional: check the storm radio before taking oil (costs one turn)");
});
