import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("keeper copy accounts for an early filled lantern before repair", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 2706, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;
  const view = observation(world, keeper);

  assert.equal(keeper.flags.includes("lantern_filled"), true);
  assert.equal(keeper.flags.includes("fuse_installed"), false);
  assert.equal(legalActions(world, keeper).includes("climb_tower"), false);
  assert.match(view.text, /before climbing unless already filled/i);
  assert.match(view.text, /repaired stair once current is restored/i);
});
