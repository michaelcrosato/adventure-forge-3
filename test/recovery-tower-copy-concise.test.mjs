import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

const recoveredTowerRoute = [
  "take_lantern",
  "enter_house",
  "study_tide_chart",
  "read_log",
  "return_for_mooring",
  "secure_mooring",
  "enter_house",
  "signal_boat",
  "check_storm_radio",
  "take_oil",
  "go_workshop",
  "take_fuse",
  "install_fuse",
  "climb_service_ladder",
  "fill_lantern",
];

test("recovered tower guidance keeps tuning choices concise", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 4000, recoveredTowerRoute);
  const beforeTuning = modelTurnInput(world, tower.observation);

  assert.equal(
    beforeTuning.text,
    "The beacon is ready; tune the beam if you wish, light now, or wait for the horn.",
  );
  assert.doesNotMatch(beforeTuning.text, /confirmed-channel|sheltered finish|strongest rescue/i);

  const afterHorn = replayActions(world, 4000, [
    ...recoveredTowerRoute,
    "trim_wick",
    "align_lens",
    "wait_for_horn",
  ]);
  const afterHornInput = modelTurnInput(world, afterHorn.observation);

  assert.equal(afterHornInput.last, "The beacon is ready; light now.");
});
