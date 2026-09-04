import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("fully tuned confirmed-channel wait label stays in-world", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 9407, [
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
    "align_lens",
  ]).state;
  const input = modelTurnInput(world, observation(world, tower));
  const wait = input.a.find(([, label]) => /wait for the horn/i.test(label));

  assert.ok(wait);
  assert.match(wait[1], /wait for the horn to improve the rescue; light next turn/i);
  assert.doesNotMatch(wait[1], /do not wait on the final turn/i);
});
