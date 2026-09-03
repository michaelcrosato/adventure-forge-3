import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the emergency release explains the supply recovery sequence", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_after_repair.text;

  assert.match(text, /missing oil/i);
  assert.match(text, /jetty return too/i);
  assert.match(text, /repaired stair/i);
});
