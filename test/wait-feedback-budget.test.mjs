import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn-wait feedback stays compact for model turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.wait_for_horn.text.length < 400);
});
