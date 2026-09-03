import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a recovered tuned beacon remains available after an early horn wait", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 1771, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
  ]).state;

  assert.equal(legalActions(world, tower).includes("light_recovered_tuned_beacon"), true);
  const ending = step(world, tower, "light_recovered_tuned_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
});
