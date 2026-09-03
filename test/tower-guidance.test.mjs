import assert from "node:assert/strict";
import test from "node:test";
import { createState, observation, loadWorld, step } from "../src/engine.mjs";

test("the lantern room hints at both beam improvements", async () => {
  const world = await loadWorld();
  let state = step(world, createState(world, 127), "take_lantern").state;
  state = step(world, state, "enter_house").state;
  state = step(world, state, "take_oil").state;
  state = step(world, state, "climb_tower").state;

  const text = observation(world, state).text;
  assert.match(text, /aligned by hand/i);
  assert.match(text, /charred wick can be trimmed/i);
});
