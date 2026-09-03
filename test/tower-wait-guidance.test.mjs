import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tower tells players to tune the beam before waiting", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.tower.text, /finish any trim or alignment before spending a turn to wait/i);
});
