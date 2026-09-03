import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the horn-wait event treats completed tuning as optional", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 2901, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
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

  assert.deepEqual(legalActions(world, replayed.state), ["light_all_ready_beacon"]);
  assert.match(replayed.observation.event, /finish any trim or alignment before lighting if needed/i);
});
