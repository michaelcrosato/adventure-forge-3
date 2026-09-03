import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a filled lantern offers a one-time wick trim bonus", async () => {
  const world = await loadWorld();
  const filled = replayActions(world, 83, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  assert.equal(legalActions(world, filled).includes("trim_wick"), true);
  const trimmed = step(world, filled, "trim_wick");
  assert.equal(trimmed.ok, true, trimmed.error);
  assert.equal(trimmed.state.score, filled.score + 1);
  assert.equal(trimmed.state.flags.includes("wick_trimmed"), true);
  assert.equal(legalActions(world, trimmed.state).includes("trim_wick"), false);
});
