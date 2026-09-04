import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("radio-confirmed pre-fill tower input keeps only the required next step", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 9305, [
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
  ]).state;
  const input = modelTurnInput(world, observation(world, state));

  assert.deepEqual(legalActions(world, state), ["fill_lantern"]);
  assert.equal(
    input.text,
    "No beacon finish is available yet; most preparation: confirmed-channel rescue. Fill the lantern to unlock the finish.",
  );
});
