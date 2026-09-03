import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("the prepared lantern room offers one-time lens alignment before lighting", async () => {
  const world = await loadWorld();
  const prepared = replayActions(world, 11, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  assert.equal(legalActions(world, prepared).includes("align_lens"), true);
  const aligned = step(world, prepared, "align_lens");
  assert.equal(aligned.ok, true, aligned.error);
  assert.equal(aligned.state.score, 6);
  assert.equal(
    aligned.state.journal.includes("The beacon lens is aligned with the channel."),
    true,
  );
  assert.equal(legalActions(world, aligned.state).includes("align_lens"), false);

  assert.equal(legalActions(world, aligned.state).includes("light_beacon"), false);
  assert.equal(legalActions(world, aligned.state).includes("light_aligned_beacon"), true);
  const ending = step(world, aligned.state, "light_aligned_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
});
