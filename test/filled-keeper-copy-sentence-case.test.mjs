import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("early-filled keeper guidance keeps its inserted status clause lowercase", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 7212, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;
  const text = observation(world, state).text;

  assert.match(text, /; lantern filled; check the radio now if time allows;/);
  assert.doesNotMatch(text, /; Lantern filled;/);
});
