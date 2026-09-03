import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the keeper observation names the one clue that remains unread", async () => {
  const world = await loadWorld();
  const logRead = replayActions(world, 8601, [
    "take_lantern",
    "enter_house",
    "read_log",
  ]).state;
  const tideRead = replayActions(world, 8602, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
  ]).state;

  assert.equal(legalActions(world, logRead).includes("study_tide_chart"), true);
  assert.equal(legalActions(world, tideRead).includes("read_log"), true);
  assert.match(observation(world, logRead).text, /wall log recorded; read the tide chart/i);
  assert.match(observation(world, tideRead).text, /tide chart recorded; read the wall log/i);
  assert.doesNotMatch(observation(world, logRead).text, /read remaining clues/i);
  assert.doesNotMatch(observation(world, tideRead).text, /read remaining clues/i);
});
