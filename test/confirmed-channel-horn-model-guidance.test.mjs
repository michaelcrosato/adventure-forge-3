import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("confirmed-channel horn feedback points to the immediate finish", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 7420, [
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
    "wait_for_horn",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.equal(input.last, "Horn bonus recorded; light the confirmed-channel beacon now.");
  assert.doesNotMatch(input.last, /light next turn|after tuning|never wait/i);
});
