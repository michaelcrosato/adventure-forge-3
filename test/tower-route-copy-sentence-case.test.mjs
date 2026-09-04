import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("failed-mooring tower guidance keeps the inserted route clause lowercase", async () => {
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
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /; the confirmed-channel route is unavailable;/);
  assert.doesNotMatch(view.text, /; The confirmed-channel route is unavailable;/);
  assert.doesNotMatch(input.text, /; The confirmed-channel route is unavailable;/);
});
