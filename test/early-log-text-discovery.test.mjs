import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("early wall-log model text keeps the route open to discovery", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 15002, [
    "take_lantern",
    "enter_house",
    "read_log",
  ]);
  const input = modelTurnInput(world, observation(world, replayed.state, replayed.observation.event));

  assert.match(input.text, /tide chart and mooring are still here to investigate/i);
  assert.match(input.text, /take the oil when ready/i);
  assert.doesNotMatch(input.text, /strongest rescue|chronometer|horn timing/i);
});
