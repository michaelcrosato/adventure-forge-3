import assert from "node:assert/strict";
import test from "node:test";
import {
  loadWorld,
  modelTurnInput,
  observation,
  replayActions,
  step,
} from "../src/engine.mjs";

test("recovered radio confirmation leaves supply choices open", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 5007, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
  ]).state;
  const checked = step(world, keeper, "check_storm_radio");
  const input = modelTurnInput(world, observation(world, checked.state, checked.event));

  assert.equal(checked.ok, true, checked.error);
  assert.equal(input.text, "The channel is clear. Take the oil or enter the workshop when ready.");
  assert.equal(input.last, "The channel is clear.");
  assert.doesNotMatch(input.text, /before taking oil|strongest rescue|optional bonus/i);
  assert.ok(input.a.some(([, label]) => /take the oil/i.test(label)));
  assert.ok(input.a.some(([, label]) => /enter the workshop/i.test(label)));
});
