import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a secured boat gets a distinct finish for a tuned beam", async () => {
  const world = await loadWorld();
  const tuned = replayActions(world, 991, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;
  const actions = legalActions(world, tuned);

  assert.equal(actions.includes("light_aligned_trimmed_beacon"), false);
  assert.equal(actions.includes("light_moored_beacon"), false);
  assert.equal(actions.includes("light_moored_aligned_trimmed_beacon"), true);

  const ending = step(world, tuned, "light_moored_aligned_trimmed_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, tuned.score + 7);
});
