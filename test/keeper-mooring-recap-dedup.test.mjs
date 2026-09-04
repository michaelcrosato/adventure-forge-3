import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper model input stops repeating a confirmed mooring status", async () => {
  const world = await loadWorld();
  const entered = replayActions(world, 9404, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
  ]).state;
  const enteredInput = modelTurnInput(world, observation(world, entered));

  assert.doesNotMatch(enteredInput.text, /Mooring is secure; the boat will hold\.$/i);
  assert.match(enteredInput.facts.join(" "), /supply boat's mooring is secure/i);

  const signaled = replayActions(world, 9405, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
  ]).state;
  const signaledInput = modelTurnInput(world, observation(world, signaled));

  assert.doesNotMatch(signaledInput.text, /Mooring is secure; the boat will hold\.$/i);
  assert.match(signaledInput.text, /boat signal already confirmed/i);
});
