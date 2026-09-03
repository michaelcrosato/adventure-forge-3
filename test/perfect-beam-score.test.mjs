import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the fully tuned beam earns a final quality bonus", async () => {
  const world = await loadWorld();
  const tuned = replayActions(world, 181, [
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

  const ending = step(world, tuned, "light_aligned_trimmed_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.score, tuned.score + 6);
});
