import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("confirmed-channel trim event identifies the beacon being lit", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 9410, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const trimmed = step(world, tower, "trim_wick");
  const input = modelTurnInput(world, observation(world, trimmed.state, trimmed.event));

  assert.match(input.last, /light the beacon with the trimmed wick now/i);
  assert.doesNotMatch(input.last, /light the trimmed beacon now/i);
});
