import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("a state-only observation keeps the stored horn bonus on the fallback label", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 902001, [
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
  ]).state;
  const fallback = observation(world, state).actions.find(([id]) => id === "light_all_ready_beacon");

  assert.ok(fallback, "expected the tuned fallback action");
  assert.match(fallback[1], /horn bonus/i);
  assert.doesNotMatch(fallback[1], /without timing bonus|wait for horn bonus/i);
});
