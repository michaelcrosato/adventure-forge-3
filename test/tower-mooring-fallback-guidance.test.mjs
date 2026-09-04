import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("failed mooring recovery removes the unreachable tower relay route", async () => {
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

  assert.equal(state.room, "tower");
  assert.equal(state.flags.includes("mooring_return_used"), true);
  assert.equal(state.flags.includes("mooring_secured"), false);
  assert.equal(legalActions(world, state).includes("check_tower_radio"), false);
  assert.match(view.text, /confirmed-channel route is unavailable/i);
  assert.match(view.text, /use the basic beacon route/i);
  assert.doesNotMatch(view.text, /tower relay can confirm|several lighting choices/i);
  assert.doesNotMatch(input.text, /tower relay can confirm|sheltered confirmed-channel rescue/i);
});
