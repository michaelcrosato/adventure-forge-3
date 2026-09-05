import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("recovered tide re-entry keeps the remaining keeper choices open", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 28000, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]);
  const input = modelTurnInput(world, observation(world, replayed.state, replayed.observation.event));

  assert.equal(
    input.text,
    "The recovered boat holds. The tide window is recorded; signal the boat, take the oil, or enter the workshop when ready.",
  );
  assert.doesNotMatch(input.text, /check radio|before climbing|repaired stair|strongest rescue/i);
  assert.match(input.last, /signal the boat for a confirmed channel/i);
});
