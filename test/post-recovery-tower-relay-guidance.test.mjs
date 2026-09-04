import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("post-recovery tower guidance drops an unreachable relay but keeps a reachable one", async () => {
  const world = await loadWorld();
  const stranded = replayActions(world, 24107, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
  ]).state;
  const strandedView = observation(world, stranded);
  const strandedInput = modelTurnInput(world, strandedView);

  assert.equal(legalActions(world, stranded).includes("check_tower_radio"), false);
  assert.match(strandedView.text, /confirmed-channel route is unavailable/i);
  assert.match(strandedInput.text, /confirmed-channel route is unavailable/i);
  assert.doesNotMatch(strandedInput.text, /tower relay can confirm/i);

  const prepared = replayActions(world, 24108, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
  ]).state;
  const preparedView = observation(world, prepared);

  assert.equal(legalActions(world, prepared).includes("check_tower_radio"), true);
  assert.match(preparedView.text, /tower relay can confirm the radio channel/i);
});
