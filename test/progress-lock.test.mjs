import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, step } from "../src/engine.mjs";

test("the keeper-room jetty return closes after the lantern is collected", async () => {
  const world = await loadWorld();
  let state = step(world, createState(world, 19), "enter_house").state;

  assert.equal(legalActions(world, state).includes("go_jetty"), true);
  state = step(world, state, "go_jetty").state;
  state = step(world, state, "take_lantern").state;
  state = step(world, state, "enter_house").state;
  assert.equal(legalActions(world, state).includes("go_jetty"), false);
});
