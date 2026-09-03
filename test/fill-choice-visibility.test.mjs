import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("filled-lantern feedback names tuning as available choices", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 4041, [
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
  assert.match(filled.event, /optional choices: trim the wick or align the beacon lens/i);
});
