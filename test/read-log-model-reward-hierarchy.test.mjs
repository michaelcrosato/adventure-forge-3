import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the bounded log event separates beam tuning from rescue-route requirements", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 291, ["enter_house", "read_log"]);
  const input = modelTurnInput(world, observation(world, replayed.state, replayed.observation.event));

  assert.match(input.last, /repair and fill are required/i);
  assert.match(input.last, /trim and align both for the strongest beam/i);
  assert.match(input.last, /confirmed channel or chronometer timing selects the strongest rescue route/i);
  assert.match(input.last, /horn timing is an optional bonus on a confirmed channel/i);
  assert.match(input.last, /required to unlock the chronometer-timed finish/i);
  assert.doesNotMatch(input.last, /tune both for the strongest rescue beam.*confirmed channel earns the strongest rescue outcome/i);
});
