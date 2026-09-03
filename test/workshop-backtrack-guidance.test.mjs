import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the workshop points supplied players toward fuse installation", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.workshop.text, /already carry both lantern and oil/i);
  assert.match(world.rooms.workshop.text, /install the fuse instead of backtracking/i);
});
