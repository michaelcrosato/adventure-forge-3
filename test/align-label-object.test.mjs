import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lens-tuning label names the object being adjusted", async () => {
  const world = await loadWorld();

  assert.match(world.actions.align_lens.label, /align lens/i);
});
