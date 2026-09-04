import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper model input puts fuse repair before lantern filling when the stair is unpowered", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 120, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "read_log",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));

  assert.match(input.text, /oil is ready; fill the lantern in the tower after the workshop repair/i);
  assert.doesNotMatch(input.text, /fill the lantern before climbing/i);
});
