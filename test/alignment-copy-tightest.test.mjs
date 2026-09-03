import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("lens-alignment feedback keeps its tightened tuning budget", async () => {
  const world = await loadWorld();
  const text = world.actions.align_lens.text;

  assert.ok(text.length < 95);
  assert.match(text, /beam will hold true.*trim the wick before lighting the beacon/i);
});
