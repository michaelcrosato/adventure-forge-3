import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("pre-repair keeper model text keeps completed setup status concise", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 126, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));

  assert.match(input.text, /boat signal already confirmed; radio channel already confirmed; oil is ready; fill the lantern in the tower after the workshop repair; then use the repaired stair/i);
  assert.doesNotMatch(input.text, /use what remains|log and tide clues are recorded|only with time/i);
});
