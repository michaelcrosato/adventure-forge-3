import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("beam-tuning feedback omits preparation that is already complete", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 3611, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  const alignedFirst = step(world, tower, "align_lens");
  const trimmedAfter = step(world, alignedFirst.state, "trim_wick");
  assert.equal(trimmedAfter.ok, true, trimmedAfter.error);
  assert.match(trimmedAfter.event, /clean, steady flame/i);
  assert.doesNotMatch(trimmedAfter.event, /align the beacon lens/i);

  const trimmedFirst = step(world, tower, "trim_wick");
  const alignedAfter = step(world, trimmedFirst.state, "align_lens");
  assert.equal(alignedAfter.ok, true, alignedAfter.error);
  assert.match(alignedAfter.event, /beam will hold true/i);
  assert.doesNotMatch(alignedAfter.event, /trim the wick/i);
});
