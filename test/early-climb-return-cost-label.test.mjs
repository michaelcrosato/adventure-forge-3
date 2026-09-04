import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("a ready confirmed-channel early climb discloses its return trip", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 9409, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));
  const climb = input.a.find(([, label]) => /unpowered stair/i.test(label));

  assert.ok(climb);
  assert.match(climb[1], /optional early climb.*fill the lantern.*return to repair the switchboard/i);
  assert.match(climb[1], /confirmed channel is ready/i);
});
