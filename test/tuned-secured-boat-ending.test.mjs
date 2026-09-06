import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("a tuned no-radio rescue credits the secured boat, not a prepared channel", async () => {
  const world = await loadWorld();
  const ending = replayActions(world, 124124, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "light_all_ready_beacon",
  ]).observation.end[2];

  assert.match(ending, /tuned beam and secured boat earn a stronger rescue/i);
  assert.doesNotMatch(ending, /prepared channel/i);
});
