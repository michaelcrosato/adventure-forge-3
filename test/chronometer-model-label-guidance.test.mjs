import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the bounded chronometer label explains its distinct timed finish", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 887, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
  ]).state;
  const view = observation(world, state);
  const raw = view.actions.find(([id]) => id === "wind_chronometer");
  const model = modelTurnInput(world, view);
  const bounded = model.a.find(([index]) => index === view.actions.indexOf(raw));

  assert.ok(raw);
  assert.ok(bounded);
  assert.match(raw[1], /optional precision prep/i);
  assert.match(bounded[1], /timed rescue after the horn wait/i);
  assert.match(bounded[1], /costs one turn/i);
});
