import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper guidance stops repeating oil pickup after oil is carried", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 8301, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
  ]).state;
  const view = observation(world, keeper);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /mooring is unsecured; return to secure it before studying the tide/i);
  assert.doesNotMatch(view.text, /mooring is unsecured; take oil/i);
  assert.match(input.text, /mooring is unsecured; return to secure it before studying the tide/i);
  assert.doesNotMatch(input.text, /mooring is unsecured; take oil/i);
});
