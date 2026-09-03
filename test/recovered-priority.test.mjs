import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("logged tide recovery promotes the tuned marked-tide finish", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 2273, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
  ]).state;

  assert.equal(legalActions(world, tower).includes("light_recovered_beacon"), false);

  const tuned = step(world, step(world, tower, "trim_wick").state, "align_lens").state;
  assert.equal(legalActions(world, tuned).includes("light_rescue_beacon"), true);
});
