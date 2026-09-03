import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the horn-wait event drops route mechanics after beam tuning is complete", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 415018, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "take_oil",
    "signal_boat",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
  ]);

  assert.match(replayed.observation.event, /beam tuning is complete.*light next turn/i);
  assert.doesNotMatch(replayed.observation.event, /horn-timed finish|marked-tide rescue/i);
});
