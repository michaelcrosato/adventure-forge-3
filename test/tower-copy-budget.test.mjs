import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("tower guidance keeps the repeated copy below 510 characters", async () => {
  const world = await loadWorld();

  assert.ok(world.rooms.tower.text.length < 510);
});
