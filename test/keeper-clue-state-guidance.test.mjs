import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the keeper observation stops asking for clues that are already recorded", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7301, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
  ]).state;
  const text = observation(world, keeper).text;

  assert.equal(legalActions(world, keeper).includes("read_log"), false);
  assert.equal(legalActions(world, keeper).includes("study_tide_chart"), false);
  assert.match(text, /log and tide clues are recorded/i);
  assert.doesNotMatch(text, /read remaining clues/i);
});
