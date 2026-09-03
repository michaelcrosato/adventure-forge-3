import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("a confirmed channel removes unavailable chronometer guidance from the early climb label", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 901102, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const view = observation(world, keeper);
  const input = modelTurnInput(world, view);
  const climb = input.a.find(([, label]) => /unpowered stair/i.test(label));

  assert.equal(legalActions(world, keeper).includes("climb_tower"), true);
  assert.ok(climb);
  assert.match(climb[1], /confirmed channel is ready/i);
  assert.match(climb[1], /fill the lantern.*repair the switchboard/i);
  assert.doesNotMatch(climb[1], /chronometer|wind/i);
});
