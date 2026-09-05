import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the early model log label follows the tide-first investigation", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 41000, ["take_lantern", "enter_house"]);
  const view = observation(world, replayed.state, replayed.observation.event);
  const input = modelTurnInput(world, view);
  const logIndex = view.actions.findIndex(([id]) => id === "read_log");
  const tideIndex = view.actions.findIndex(([id]) => id === "study_tide_chart");

  assert.equal(logIndex, 1);
  assert.equal(tideIndex, 0);
  assert.equal(input.a[logIndex][1], "Read the wall log after studying the tide chart");
  assert.match(input.a[tideIndex][1], /^Study the tide chart$/i);
});
