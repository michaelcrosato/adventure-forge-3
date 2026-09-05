import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("secured mooring distinguishes boat signaling from radio confirmation", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 79811, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]);

  assert.match(replayed.observation.event, /signal the boat for a confirmed channel/i);
  assert.match(replayed.observation.event, /signal only holds position/i);
  assert.match(replayed.observation.event, /later radio check confirms the channel/i);
});
