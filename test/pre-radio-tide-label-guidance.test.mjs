import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the bounded pre-radio menu surfaces the tide clue before its optional check", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 100025, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);
  const tide = input.a.find(([index]) => view.actions[index][0] === "study_tide_chart");

  assert.ok(tide);
  assert.equal(tide[1], "Study the tide chart before the optional radio check");
  assert.doesNotMatch(tide[1], /tower relay|costs one turn|take oil/i);
});
