import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("beacon endings distinguish optional preparation", async () => {
  const world = await loadWorld();
  const basic = replayActions(world, 812, world.winningPlan).observation;
  const prepared = replayActions(world, 813, [
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
    "light_all_ready_beacon",
  ]).observation;

  assert.match(basic.end[2], /without optional preparation/i);
  assert.match(prepared.end[2], /stronger rescue/i);
  assert.notEqual(basic.end[2], prepared.end[2]);
});
