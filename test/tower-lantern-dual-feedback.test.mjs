import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the missing-lantern return covers missing oil too", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_for_lantern.text;

  assert.match(text, /missing lantern/i);
  assert.match(text, /oil too if needed/i);
  assert.match(text, /climbing again/i);
});
