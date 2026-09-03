import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a fully tuned lantern room offers a dedicated final action", async () => {
  const world = await loadWorld();
  const tuned = replayActions(world, 149, [
    "take_lantern",
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

  assert.equal(legalActions(world, tuned).includes("light_aligned_beacon"), false);
  assert.equal(legalActions(world, tuned).includes("light_aligned_trimmed_beacon"), true);
  const ending = step(world, tuned, "light_aligned_trimmed_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
});
