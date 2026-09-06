import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("secured mooring labels the channel hint without attributing confirmation to signaling", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 80207, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]);

  assert.match(replayed.observation.event, /keeper's penciled instruction says: signal the boat to hold position/i);
  assert.match(replayed.observation.event, /the signal only holds position/i);
  assert.match(replayed.observation.event, /later radio check confirms the channel/i);
  assert.match(replayed.observation.event, /old shorthand ["']signal the boat for a confirmed channel["'] as incomplete/i);
  assert.doesNotMatch(replayed.observation.event, /signal the boat for a confirmed channel if desired/i);
});
