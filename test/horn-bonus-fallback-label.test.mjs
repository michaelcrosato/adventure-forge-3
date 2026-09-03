import test from "node:test";
import assert from "node:assert/strict";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the tuned fallback label acknowledges a stored horn bonus", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 488020, [
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
  const fallback = replayed.observation.actions.find(([id]) => id === "light_all_ready_beacon");

  assert.ok(fallback, "expected the tuned fallback action");
  assert.match(fallback[1], /horn bonus/i);
  assert.doesNotMatch(fallback[1], /without timing bonus/i);
});
