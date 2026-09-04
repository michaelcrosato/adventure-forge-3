import assert from "node:assert/strict";
import test from "node:test";
import {
  legalActions,
  loadWorld,
  modelTurnInput,
  observation,
  replayActions,
  step,
} from "../src/engine.mjs";

test("an early climb omits closed boat and chronometer recovery guidance", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 131201, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const climbed = step(world, keeper, "climb_tower");

  assert.equal(climbed.ok, true, climbed.error);
  assert.deepEqual(legalActions(world, climbed.state), [
    "fill_lantern",
    "return_keeper_after_fill",
  ]);
  assert.match(climbed.event, /return to read the wall log, then repair the switchboard/i);
  assert.doesNotMatch(climbed.event, /secure and signal|wind the chronometer/i);

  const input = modelTurnInput(world, observation(world, climbed.state, climbed.event));
  assert.match(input.last, /return to read the wall log, then repair the switchboard/i);
  assert.doesNotMatch(input.last, /secure and signal|wind the chronometer/i);
});
