import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("fully tuned confirmed-channel input drops the completed clue recap", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 9401, [
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

  assert.match(input.text, /beam tuning is complete/i);
  assert.doesNotMatch(input.text, /log and tide chart are recorded/i);
  assert.doesNotMatch(input.text, /radio channel already confirmed/i);
  assert.match(input.facts.join(" "), /radio channel clear/i);
  assert.match(input.facts.join(" "), /beacon lens is aligned/i);
});
