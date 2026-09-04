import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("recovery guidance drops a radio action that can no longer be reached", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 24106, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
    "climb_service_ladder",
    "return_keeper_from_tower",
    "go_jetty",
    "take_lantern",
    "enter_house",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, state).includes("check_storm_radio"), false);
  assert.match(view.text, /radio confirmation is unavailable on this route/i);
  assert.match(input.text, /radio confirmation is unavailable on this route/i);
  assert.doesNotMatch(input.text, /check the radio after the clues|check radio if needed/i);
});
