import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tower names the strongest no-signal rescue", async () => {
  const world = await loadWorld();
  const text = world.rooms.tower.text;

  assert.match(text, /secured-boat tuned rescue at tide/i);
  assert.ok(text.length < 560);
});
