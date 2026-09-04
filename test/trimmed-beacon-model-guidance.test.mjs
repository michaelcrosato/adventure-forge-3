import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions, step } from "../src/engine.mjs";

test("trimmed-beacon model feedback keeps ignition separate", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 7422, [
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
  const replayed = replayActions(world, 7422, [
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
    "trim_wick",
  ]);
  assert.equal(trimmed.ok, true, trimmed.error);

  const input = modelTurnInput(world, replayed.observation);
  assert.match(input.last, /wick trimmed; beacon remains dark/i);
  assert.match(input.last, /light the beacon with the trimmed wick now/i);
  assert.doesNotMatch(input.last, /clean, steady flame/i);
});
