import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("bounded tower input stops advertising the closed sheltered route after radio confirmation", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 9301, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
    "climb_tower",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, state).includes("close_storm_shutters"), false);
  assert.match(view.text, /bar shutters: sheltered finish/i);
  assert.match(input.text, /sheltered finish is unavailable after radio confirmation/i);
  assert.match(input.text, /use the confirmed-channel finish/i);
  assert.doesNotMatch(input.text, /bar shutters: sheltered finish/i);

  const relayState = replayActions(world, 9303, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "check_tower_radio",
  ]).state;
  const relayInput = modelTurnInput(world, observation(world, relayState));

  assert.equal(relayState.journal.some((fact) => /channel is clear/i.test(fact)), true);
  assert.equal(legalActions(world, relayState).includes("close_storm_shutters"), false);
  assert.match(relayInput.text, /sheltered finish is unavailable after radio confirmation/i);
  assert.doesNotMatch(relayInput.text, /bar shutters: sheltered finish/i);

  const recovered = replayActions(world, 9302, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
  ]).state;
  const recoveredInput = modelTurnInput(world, observation(world, recovered));

  assert.equal(recovered.flags.includes("supply_return_used"), true);
  assert.match(recoveredInput.text, /bar shutters: sheltered finish/i);
});
