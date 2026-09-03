import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the objective states the available turn limit", async () => {
  const world = await loadWorld();

  assert.match(world.objective, /within 24 turns/i);
});
