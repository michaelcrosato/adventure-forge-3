import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("keeper guidance confirms a completed boat signal", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 24004, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
  ]).state;
  const text = observation(world, keeper).text;

  assert.match(text, /boat signal already confirmed/i);
  assert.doesNotMatch(text, /signal the boat first if needed/i);
});
