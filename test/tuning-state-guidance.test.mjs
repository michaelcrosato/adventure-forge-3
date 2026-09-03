import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("beam-tuning feedback only repeats unfinished work", async () => {
  const world = await loadWorld();

  assert.match(world.actions.trim_wick.text, /if it is not already aligned/i);
  assert.match(world.actions.align_lens.text, /if it is not already trimmed/i);
});
