import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, step } from "../src/engine.mjs";

test("the tower stair opens once the lantern and oil are together", async () => {
  const world = await loadWorld();
  let state = step(world, createState(world, 23), "enter_house").state;

  assert.equal(legalActions(world, state).includes("climb_tower"), false);
  state = step(world, state, "go_jetty").state;
  state = step(world, state, "take_lantern").state;
  state = step(world, state, "enter_house").state;
  assert.equal(legalActions(world, state).includes("climb_tower"), false);
  state = step(world, state, "take_oil").state;
  assert.equal(legalActions(world, state).includes("climb_tower"), true);
});
