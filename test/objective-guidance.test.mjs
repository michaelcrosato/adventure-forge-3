import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the objective explains the reward for optional preparation", async () => {
  const world = await loadWorld();

  assert.match(world.objective, /optional preparation/i);
  assert.match(world.objective, /stronger rescue/i);
});
