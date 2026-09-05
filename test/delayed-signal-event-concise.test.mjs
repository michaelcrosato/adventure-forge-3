import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("delayed boat signaling keeps its feedback focused on the remaining clues", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 23001, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");
  const input = modelTurnInput(world, observation(world, signaled.state, signaled.event));

  assert.equal(signaled.ok, true, signaled.error);
  assert.equal(signaled.event, "Ring the bell; supply boat holds position. The tide chart and oil are still waiting.");
  assert.ok(signaled.event.length < 100);
  assert.doesNotMatch(signaled.event, /unlock|costs one turn|tower relay|storm radio/i);
  assert.equal(input.text, "The boat holds. The tide chart and oil are still waiting; choose what to investigate next.");
});
