import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("trimming the wick points to the remaining lens adjustment", async () => {
  const world = await loadWorld();
  const text = world.actions.trim_wick.text;

  assert.match(text, /clean, steady flame/i);
  assert.match(text, /align the beacon lens before lighting/i);
});
