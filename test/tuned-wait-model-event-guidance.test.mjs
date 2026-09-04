import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("tuned horn-wait model input drops spent tuning prerequisites", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 22001, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
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

  assert.match(replayed.observation.event, /finish any trim or alignment before lighting if needed/i);
  assert.match(input.last, /beam tuning is complete.*light next turn/i);
  assert.doesNotMatch(input.last, /finish any trim or alignment|after tuning/i);
});
