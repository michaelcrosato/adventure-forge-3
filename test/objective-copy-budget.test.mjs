import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the objective keeps its repeated model copy compact", async () => {
  const world = await loadWorld();

  assert.ok(world.objective.length < 95);
});
