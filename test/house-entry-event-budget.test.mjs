import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("house-entry feedback stays compact for routing turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.enter_house.text.length < 150);
});
