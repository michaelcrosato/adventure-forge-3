import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, step } from "../src/engine.mjs";

test("the keeper's room keeps abandonment available mid-game", async () => {
  const world = await loadWorld();
  const entered = step(world, step(world, createState(world, 1883), "take_lantern").state, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.equal(legalActions(world, entered.state).includes("leave_island"), true);
  const departed = step(world, entered.state, "leave_island");
  assert.equal(departed.ok, true, departed.error);
  assert.equal(departed.state.ending, "left");
});
