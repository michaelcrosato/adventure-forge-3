import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("pre-fill confirmed-channel input drops unrelated finish categories", async () => {
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

  assert.match(input.text, /no beacon finish is available yet; most preparation: confirmed-channel rescue/i);
  assert.doesNotMatch(input.text, /secured-boat tuned rescue|horn-timed rescue|marked-tide rescue|fully prepared/i);
});
