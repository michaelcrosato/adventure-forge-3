import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the tower observation names the remaining beam upgrade", async () => {
  const world = await loadWorld();
  const prepared = [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ];
  const lensOnly = replayActions(world, 9001, [...prepared, "align_lens"]).state;
  const wickOnly = replayActions(world, 9002, [...prepared, "trim_wick"]).state;

  assert.equal(legalActions(world, lensOnly).includes("light_aligned_beacon"), true);
  assert.equal(legalActions(world, wickOnly).includes("light_trimmed_beacon"), true);
  assert.match(
    observation(world, lensOnly).text,
    /lens aligned; trim the wick before lighting if desired, or light the aligned beacon/i,
  );
  assert.match(
    observation(world, wickOnly).text,
    /wick trimmed; align the beacon lens before lighting if desired, or light the clean flame/i,
  );
  assert.doesNotMatch(observation(world, lensOnly).text, /aligned by hand if needed/i);
  assert.doesNotMatch(observation(world, wickOnly).text, /charred wick can be trimmed/i);
});
