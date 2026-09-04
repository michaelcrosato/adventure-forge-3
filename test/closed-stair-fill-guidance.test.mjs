import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("closed stair guidance does not repeat the pending lantern fill", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 16003, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, state).includes("climb_repaired_stairs"), false);
  assert.match(input.text, /lantern still needs filling/i);
  assert.match(input.text, /repaired-stair return is closed; after filling the lantern/i);
  assert.doesNotMatch(input.text, /oil is ready; fill the lantern before climbing/i);
});

test("closed stair guidance stays singular after radio confirmation", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 16004, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, state).includes("climb_repaired_stairs"), false);
  assert.match(input.text, /radio channel already confirmed; oil is ready; the repaired-stair return is closed; after filling the lantern/i);
  assert.doesNotMatch(input.text, /oil is ready; fill the lantern before climbing/i);
});
