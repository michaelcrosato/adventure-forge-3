import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("beam-tuning labels warn against spending the last turn", async () => {
  const world = await loadWorld();

  assert.match(world.actions.trim_wick.label, /before last turn/i);
  assert.match(world.actions.align_lens.label, /by last turn/i);
});
