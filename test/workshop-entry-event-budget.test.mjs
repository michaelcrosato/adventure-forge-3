import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("workshop entry feedback stays compact for routing turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.go_workshop.text.length < 155);
});
