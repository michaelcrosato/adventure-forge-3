import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a trimmed but unaligned lantern offers a clean-flame finish", async () => {
  const world = await loadWorld();
  const trimmed = replayActions(world, 97, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
  ]).state;

  assert.equal(legalActions(world, trimmed).includes("light_beacon"), false);
  assert.equal(legalActions(world, trimmed).includes("light_trimmed_beacon"), true);
  const ending = step(world, trimmed, "light_trimmed_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
});
