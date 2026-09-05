import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("early wall-log feedback leaves the rescue formula to discovery", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 15001, [
    "take_lantern",
    "enter_house",
    "read_log",
  ]);
  const input = modelTurnInput(world, observation(world, replayed.state, replayed.observation.event));

  assert.match(replayed.observation.event, /confirmed channel or chronometer timing selects the strongest rescue route/i);
  assert.equal(input.last, "The wall log names the repair and lantern work; the rest is left to the keeper.");
  assert.doesNotMatch(input.last, /strongest rescue|chronometer|horn timing|confirmed channel/i);
});
