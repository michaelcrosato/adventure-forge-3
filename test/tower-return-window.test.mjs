import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("the switchboard return has one window before and one after filling", async () => {
  const world = await loadWorld();
  let tower = replayActions(world, 307, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
  ]).state;

  assert.equal(legalActions(world, tower).includes("return_keeper_after_fill"), true);
  tower = step(world, tower, "return_keeper_after_fill").state;
  tower = step(world, tower, "climb_tower").state;
  assert.equal(legalActions(world, tower).includes("return_keeper_after_fill"), false);

  tower = step(world, tower, "fill_lantern").state;
  assert.equal(tower.flags.includes("tower_return_used"), false);
  assert.equal(legalActions(world, tower).includes("return_keeper_after_fill"), true);
});
