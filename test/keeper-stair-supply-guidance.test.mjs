import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("keeper copy requires ready supplies before the repaired stair", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 2801, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
  ]).state;
  const view = observation(world, keeper);

  assert.equal(keeper.flags.includes("fuse_installed"), true);
  assert.equal(keeper.inventory.includes("lantern"), false);
  assert.equal(legalActions(world, keeper).includes("climb_repaired_stairs"), false);
  assert.match(view.text, /repaired stair once current is restored and supplies are ready/i);
});
