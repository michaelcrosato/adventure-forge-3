import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("secured mooring model event keeps the signal sequence concise", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 86003, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(input.last, /signal it to hold position; a later radio check confirms the channel/i);
  assert.match(input.last, /signal the boat for a confirmed channel/i);
  assert.doesNotMatch(input.last, /penciled instruction|margin labels|old shorthand|as incomplete|crossed out/i);
  assert.ok(input.last.length < 200, input.last);
});
