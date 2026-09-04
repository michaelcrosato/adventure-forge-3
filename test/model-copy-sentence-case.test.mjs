import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("bounded model copy keeps dynamic semicolon clauses in sentence case", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 2026, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "check_storm_radio",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /; Radio channel already confirmed/i);
  assert.match(input.text, /; radio channel already confirmed/i);
  assert.doesNotMatch(input.text, /; [A-Z]/);
});
