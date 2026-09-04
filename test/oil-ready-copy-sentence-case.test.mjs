import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("carried-oil keeper guidance keeps the inserted clause in sentence case", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7231, [
    "take_lantern",
    "enter_house",
    "take_oil",
  ]).state;
  const text = observation(world, keeper).text;

  assert.match(text, /; oil is ready; fill the lantern before climbing;/i);
  assert.doesNotMatch(text, /; Oil is ready;/);
});
