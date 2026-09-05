import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("recovered tide feedback keeps the cutoff without prescribing the route", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 32000, [
    "take_lantern",
    "enter_house",
    "read_log",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
  ]).state;
  const studied = step(world, keeper, "study_tide_chart");
  const input = modelTurnInput(world, observation(world, studied.state, studied.event));

  assert.equal(studied.ok, true, studied.error);
  assert.equal(
    studied.event,
    "The tide chart marks the next high tide. Use turn 24 as the high-tide cutoff; 16 turns remain to reach and light the beacon. The storm radio is now available.",
  );
  assert.equal(input.last, studied.event);
  assert.doesNotMatch(studied.event, /stronger rescue|check it before taking oil|costs one turn/i);
});
