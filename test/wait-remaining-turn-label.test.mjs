import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn-wait label explains the one-turn deadline", async () => {
  const world = await loadWorld();

  assert.match(world.actions.wait_for_horn.label, /one turn remaining.*light now/i);
});
