import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("early signal model text leaves the next investigation open", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 21001, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.equal(input.text, "The boat holds. The tide chart and oil are waiting; choose what to investigate next.");
  assert.doesNotMatch(input.text, /unlock|before climbing|costs one turn|tower relay|storm radio/i);
  assert.match(input.last, /boat holds\. study the tide chart to unlock the storm radio/i);
});
