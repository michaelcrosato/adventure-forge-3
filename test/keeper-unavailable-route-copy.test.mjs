import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper copy does not repeat radio unavailability after closing both routes", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 24110, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /secured-boat and radio routes are unavailable/i);
  assert.doesNotMatch(view.text, /radio confirmation is unavailable on this route/i);
  assert.doesNotMatch(input.text, /radio confirmation is unavailable on this route/i);
});
