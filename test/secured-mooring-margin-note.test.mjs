import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the recovered mooring keeps its wording correction in-world", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 79812, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]);

  assert.match(replayed.observation.event, /the margin labels old shorthand/i);
  assert.doesNotMatch(replayed.observation.event, /it marks the old shorthand/i);
});
