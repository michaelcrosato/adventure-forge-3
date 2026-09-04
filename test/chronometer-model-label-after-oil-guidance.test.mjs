import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the bounded chronometer label stays accurate after oil is carried", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 165, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "read_log",
    "take_oil",
    "study_tide_chart",
  ]).state;
  const view = observation(world, state);
  const rawIndex = view.actions.findIndex(([id]) => id === "wind_chronometer");
  const model = modelTurnInput(world, view);
  const bounded = model.a.find(([index]) => index === rawIndex);

  assert.ok(view.inv.includes("oil"));
  assert.equal(view.actions.some(([id]) => id === "check_storm_radio"), false);
  assert.ok(bounded);
  assert.match(bounded[1], /skip the keeper-room radio, then use the later tower relay if needed/i);
  assert.doesNotMatch(bounded[1], /before taking oil/i);
});
