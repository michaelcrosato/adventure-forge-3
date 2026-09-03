import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the tuned tower copy treats completed preparation as optional", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 2400, [
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
  const view = observation(world, tower);

  assert.deepEqual(legalActions(world, tower), ["light_aligned_trimmed_beacon"]);
  assert.match(view.text, /aligned by hand if needed/i);
  assert.match(view.text, /charred wick can be trimmed before lighting the beacon if needed/i);
  assert.match(view.text, /tower relay can confirm the radio channel after the lantern is filled if needed/i);
});
