import assert from "node:assert/strict";
import test from "node:test";
import {
  loadWorld,
  modelTurnInput,
  observation,
  replayActions,
  step,
} from "../src/engine.mjs";

test("recovered post-signal input leaves preparation choices open", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 5006, [
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
  assert.equal(input.text, "The boat holds position. The radio, oil, and workshop are ready when you are.");
  assert.equal(input.last, "The boat holds position.");
  assert.doesNotMatch(input.text, /before taking oil|strongest rescue|optional bonus/i);
  assert.ok(input.a.some(([, label]) => /optional: check the storm radio/i.test(label)));
});
