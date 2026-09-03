import assert from "node:assert/strict";
import test from "node:test";
import { createState, observation, loadWorld, step } from "../src/engine.mjs";

test("the keeper room explains the lantern's oil requirement", async () => {
  const world = await loadWorld();
  const keeper = step(world, createState(world, 197), "enter_house").state;

  assert.match(observation(world, keeper).text, /hand lantern will need oil/i);
});
