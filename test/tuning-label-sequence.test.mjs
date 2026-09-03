import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("beam-tuning labels put lighting before the deadline cue", async () => {
  const world = await loadWorld();

  assert.match(world.actions.trim_wick.label, /tune before last turn/i);
  assert.match(world.actions.align_lens.label, /tune by last turn/i);
});
