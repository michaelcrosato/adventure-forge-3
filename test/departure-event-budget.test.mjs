import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("departure feedback stays compact for final turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.leave_island.text.length < 65);
});
