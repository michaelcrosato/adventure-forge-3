import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("tide-read mooring recovery label leaves the next discovery open", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 929001, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
  ]).state;
  const action = observation(world, keeper).actions.find(([id]) => id === "return_for_mooring");

  assert.ok(action);
  assert.equal(action[1], "Return to secure the mooring before lighting");
  assert.doesNotMatch(action[1], /recovery remains open|if mooring unsecured/i);
});
