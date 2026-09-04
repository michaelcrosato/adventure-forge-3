import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("confirmed-channel early climb labels its no-payoff return cost", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 990001, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const input = modelTurnInput(world, observation(world, keeper));
  const climb = input.a.find(([, label]) => /unpowered stair/i.test(label));

  assert.equal(legalActions(world, keeper).includes("climb_tower"), true);
  assert.ok(climb);
  assert.match(climb[1], /no tower work until the fuse is installed/i);
  assert.match(climb[1], /costs a return/i);
  assert.match(climb[1], /fill the lantern.*return to repair the switchboard/i);
});
