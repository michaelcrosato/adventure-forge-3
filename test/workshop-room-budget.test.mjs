import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("workshop room guidance stays compact for recurring turns", async () => {
  const world = await loadWorld();

  assert.ok(world.rooms.workshop.text.length < 360);
});
