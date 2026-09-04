import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("tower finish guidance keeps its inserted clause lowercase", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 1, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "enter_house",
    "climb_tower",
  ]).state;
  const text = observation(world, state).text;

  assert.match(text, /; finish any trim or alignment before lighting\./);
  assert.doesNotMatch(text, /; Finish any trim or alignment before lighting\./);
});
