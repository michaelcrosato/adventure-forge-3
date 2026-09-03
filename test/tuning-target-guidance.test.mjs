import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("beam-tuning feedback names the beacon as the final target", async () => {
  const world = await loadWorld();

  assert.match(world.actions.trim_wick.text, /before lighting the beacon/i);
  assert.match(world.actions.align_lens.text, /before lighting the beacon/i);
});
