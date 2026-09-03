import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("aligning the lens points to the remaining wick trim", async () => {
  const world = await loadWorld();
  const text = world.actions.align_lens.text;

  assert.match(text, /beam will hold true/i);
  assert.match(text, /trim the wick before lighting/i);
});
