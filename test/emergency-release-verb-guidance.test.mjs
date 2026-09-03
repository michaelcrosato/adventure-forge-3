import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the emergency-release event explains where it sends the player", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_after_repair.text;

  assert.match(text, /emergency release sends you to the keeper's room/i);
  assert.ok(text.length < 170);
});
