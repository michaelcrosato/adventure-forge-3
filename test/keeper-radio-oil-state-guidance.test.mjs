import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("keeper guidance combines confirmed radio and carried oil", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 8104, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const text = observation(world, keeper).text;

  assert.match(text, /radio channel already confirmed;.*oil is ready; fill the lantern before climbing/i);
  assert.doesNotMatch(text, /check radio if needed before taking the oil/i);
});
