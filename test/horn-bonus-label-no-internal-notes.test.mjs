import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the post-horn tuned-beacon label omits internal fallback notes", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 510020, [
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
  const action = replayed.observation.actions.find(([id]) => id === "light_all_ready_beacon");

  assert.ok(action, "expected the tuned-beacon action");
  assert.match(action[1], /horn bonus/i);
  assert.doesNotMatch(action[1], /fallback|no marked tide/i);
});
