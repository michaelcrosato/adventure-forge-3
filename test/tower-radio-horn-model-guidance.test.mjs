import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("tower-radio horn feedback tells the model to light when it is the only choice", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 239, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "read_log",
    "take_oil",
    "study_tide_chart",
    "wind_chronometer",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "check_tower_radio",
    "wait_for_horn",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(input.last, /horn bonus recorded; light the confirmed-channel beacon now/i);
  assert.doesNotMatch(input.last, /after tuning|light next turn/i);
  assert.equal(input.a.length, 1);
  assert.match(input.a[0][1], /light the confirmed-channel rescue beacon/i);
});
