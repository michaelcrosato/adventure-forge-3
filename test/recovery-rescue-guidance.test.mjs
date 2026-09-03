import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the emergency release reassures players about a moored rescue", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_after_repair.text;

  assert.match(text, /moored boat can still be rescued/i);
  assert.ok(text.length < 170);
});
