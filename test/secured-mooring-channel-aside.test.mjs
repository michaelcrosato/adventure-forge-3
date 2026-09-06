import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the recovered mooring keeps legacy wording in a marginal aside", async () => {
  const world = await loadWorld();
  const event = replayActions(world, 79813, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]).observation.event;

  assert.match(
    event,
    /later radio check confirms the channel \(the margin labels old shorthand ["']signal the boat for a confirmed channel["'] as incomplete\)/i,
  );
});
