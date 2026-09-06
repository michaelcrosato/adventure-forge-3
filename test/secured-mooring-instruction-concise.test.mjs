import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("secured mooring instruction omits the crossed-out line commentary", async () => {
  const world = await loadWorld();
  const event = replayActions(world, 86001, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]).observation.event;

  assert.match(event, /signal the boat to hold position; the signal only holds position/i);
  assert.match(event, /later radio check confirms the channel/i);
  assert.doesNotMatch(event, /only that old line is crossed out/i);
});
