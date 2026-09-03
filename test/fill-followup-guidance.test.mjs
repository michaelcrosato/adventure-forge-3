import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("filling the lantern points to both beam-tuning choices", async () => {
  const world = await loadWorld();
  const text = world.actions.fill_lantern.text;

  assert.match(text, /small flame holds steady/i);
  assert.match(text, /trim the wick or align the beacon lens before lighting/i);
});
