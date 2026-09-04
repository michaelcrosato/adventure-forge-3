import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("tide-chart model event exposes the concrete high-tide cutoff", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 418019, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.equal(replayed.state.turn, 6);
  assert.match(replayed.observation.event, /before the next high tide/i);
  assert.match(input.last, /turn 24 as the high-tide cutoff; 18 turns remain to reach and light the beacon/i);
});
