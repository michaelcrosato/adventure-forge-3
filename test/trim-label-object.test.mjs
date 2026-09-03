import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the wick-tuning label names the object being adjusted", async () => {
  const world = await loadWorld();

  assert.match(world.actions.trim_wick.label, /trim wick/i);
});
