import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("filled-lantern feedback separates independent upgrades from the next required step", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 524020, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const filled = step(world, tower, "fill_lantern");

  assert.equal(filled.ok, true, filled.error);
  assert.match(filled.event, /next: light the beacon/i);
  assert.match(filled.event, /each tuning step is an independent optional upgrade/i);
});
