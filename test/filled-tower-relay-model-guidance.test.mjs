import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("filled lantern tower model input drops the spent relay prerequisite", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 17001, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const view = observation(world, tower);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /tower relay can confirm the radio channel after the lantern is filled if needed/i);
  assert.match(input.text, /tower relay can confirm the radio channel if needed/i);
  assert.doesNotMatch(input.text, /tower relay can confirm the radio channel after the lantern is filled/i);
});
