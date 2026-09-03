import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("oil pickup describes its destination without an imperative", async () => {
  const world = await loadWorld();
  const text = world.actions.take_oil.text;

  assert.match(text, /it belongs in the hand lantern before climbing/i);
  assert.doesNotMatch(text, /;\s*carry it/i);
});
