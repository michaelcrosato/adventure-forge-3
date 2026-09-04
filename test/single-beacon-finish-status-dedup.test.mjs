import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the tower does not repeat a lone finish while horn waiting remains available", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 92002, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));

  assert.equal(state.turn, 13);
  assert.equal(legalActions(world, state).includes("wait_for_horn"), true);
  assert.match(input.text, /finish any trim or alignment before spending a turn to wait/i);
  assert.doesNotMatch(input.text, /one beacon finish remains; light when ready/i);
  assert.match(input.a.map(([, label]) => label).join(" "), /light the beacon for the waiting boat/i);
});
