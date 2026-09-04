import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("fully tuned tower input keeps one readiness sentence", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 131, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "read_log",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));

  assert.match(input.text, /Beam tuning is complete; light now or wait for the horn\./i);
  assert.doesNotMatch(input.text, /A beacon finish is ready; light now or wait for the horn/i);
});
