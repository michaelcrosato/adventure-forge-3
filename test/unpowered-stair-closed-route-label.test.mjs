import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the unpowered stair label names the basic route when boat preparation is closed", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 131202, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;

  assert.equal(legalActions(world, state).includes("signal_boat"), false);
  const view = observation(world, state);
  const climb = view.actions.find(([id]) => id === "climb_tower");
  assert.ok(climb);
  assert.match(climb[1], /secured-boat and radio preparation is unavailable.*fill the lantern.*repair the switchboard/i);
  assert.doesNotMatch(climb[1], /finish keeper preparation/i);

  const input = modelTurnInput(world, view);
  const modelClimb = input.a.find(([, label]) => /unpowered stair/i.test(label));
  assert.ok(modelClimb);
  assert.match(modelClimb[1], /secured-boat and radio preparation is unavailable.*fill the lantern.*repair the switchboard/i);
});
