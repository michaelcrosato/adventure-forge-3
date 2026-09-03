import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the emergency release keeps its recovery sequence compact", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_after_repair.text;

  assert.ok(text.length < 170);
  assert.match(text, /keeper's room/i);
  assert.match(text, /missing oil.*jetty return too.*repaired stair/i);
});
