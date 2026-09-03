import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("horn-wait label marks lighting as the next step after the wait", async () => {
  const world = await loadWorld();
  const label = world.actions.wait_for_horn.label;

  assert.match(label, /one turn remaining: light now/i);
});
