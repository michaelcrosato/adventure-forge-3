import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room names the secured-boat tuned finish", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.tower.text, /secured-boat tuned rescue/i);
  assert.ok(world.rooms.tower.text.length < 560);
});
