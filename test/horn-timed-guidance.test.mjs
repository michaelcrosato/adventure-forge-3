import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room names the horn-timed rescue choice", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.tower.text, /horn-timed rescue/i);
});
