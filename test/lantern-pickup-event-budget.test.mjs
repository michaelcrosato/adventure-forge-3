import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("lantern-pickup feedback stays compact for routing turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.take_lantern.text.length < 125);
});
