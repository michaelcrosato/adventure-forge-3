import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("waiting for the horn grants a small timing bonus", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 673, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  const waited = step(world, tower, "wait_for_horn");
  assert.equal(waited.ok, true, waited.error);
  assert.equal(waited.state.score, tower.score + 1);
});
