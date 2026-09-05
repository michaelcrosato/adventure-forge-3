import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("tide-first wall-log reading keeps route rules out of the keeper's note", async () => {
  const world = await loadWorld();
  const beforeTide = replayActions(world, 121001, ["take_lantern", "enter_house"]).state;
  const beforeTideActions = observation(world, beforeTide).actions;
  assert.deepEqual(beforeTideActions.slice(0, 2).map(([id]) => id), [
    "study_tide_chart",
    "read_log",
  ]);
  assert.equal(
    modelTurnInput(world, observation(world, beforeTide)).text,
    "Study the tide chart first; then read the wall log; take the oil before climbing; fill the lantern in the tower; return to secure the mooring before climbing.",
  );

  const keeper = step(world, beforeTide, "study_tide_chart").state;
  const logged = step(world, keeper, "read_log");
  assert.equal(logged.ok, true, logged.error);
  assert.equal(
    logged.event,
    "The keeper's note is brief: mend the switchboard, fill the hand lantern, and wake the beacon before the tide turns.",
  );
  assert.doesNotMatch(logged.event, /strongest rescue route|chronometer route|horn timing|selects/i);
});
