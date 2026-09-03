import assert from "node:assert/strict";
import test from "node:test";
import { createState, observation, loadWorld, step } from "../src/engine.mjs";

test("the workshop explains that the fuse opens the tower route", async () => {
  const world = await loadWorld();
  const state = step(world, createState(world, 71), "enter_house").state;
  const workshop = step(world, state, "go_workshop").state;

  assert.match(observation(world, workshop).text, /install it before leaving/i);
  assert.match(observation(world, workshop).text, /service ladder/i);
});
