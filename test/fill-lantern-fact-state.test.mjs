import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("filling the lantern records that the beacon remains dark", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 521020, [
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
  assert.ok(filled.state.journal.includes("Hand lantern filled; beacon remains dark."));
  assert.equal(filled.state.journal.includes("Hand lantern filled and lit."), false);
});
