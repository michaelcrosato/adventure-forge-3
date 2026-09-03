import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("a fully tuned shutter label does not ask for spent beam adjustments", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 915002, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
  ]).state;
  const input = modelTurnInput(world, observation(world, tower));
  const shutter = input.a.find(([, label]) => /close storm shutters/i.test(label));

  assert.equal(legalActions(world, tower).includes("close_storm_shutters"), true);
  assert.ok(shutter);
  assert.match(shutter[1], /sheltered finish/i);
  assert.match(shutter[1], /beam tuning is complete/i);
  assert.doesNotMatch(shutter[1], /finish trim\/alignment first/i);
});
