import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("tide-chart feedback gives the player a concrete cutoff once", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 110001, ["take_lantern", "enter_house"]).state;
  const studied = step(world, keeper, "study_tide_chart");
  const input = modelTurnInput(world, observation(world, studied.state, studied.event));

  assert.equal(studied.ok, true, studied.error);
  assert.match(
    studied.event,
    /before the next high tide\. Use turn 24 as the high-tide cutoff; 21 turns remain to reach and light the beacon\./i,
  );
  assert.match(input.last, /turn 24 as the high-tide cutoff; 21 turns remain/i);
  assert.equal((input.last.match(/high-tide cutoff/gi) ?? []).length, 1);
});
