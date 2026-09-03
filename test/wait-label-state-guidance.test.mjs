import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn-wait label covers both legal entry points", async () => {
  const world = await loadWorld();
  const label = world.actions.wait_for_horn.label;

  assert.match(label, /after fill/i);
  assert.match(label, /after beam tuning/i);
});
