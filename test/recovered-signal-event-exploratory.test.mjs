import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("recovered signal feedback keeps the radio order open", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 45000, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");
  const input = modelTurnInput(world, observation(world, signaled.state, signaled.event));

  assert.equal(signaled.ok, true, signaled.error);
  assert.equal(
    signaled.event,
    "Ring the bell; supply boat holds position. The radio and oil are waiting.",
  );
  assert.doesNotMatch(signaled.event, /before taking oil|strongest rescue/i);
  assert.equal(input.text, "The boat holds position. The radio, oil, and workshop are ready when you are.");
  assert.equal(input.last, "The boat holds position.");
});
