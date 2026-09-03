import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("horn-wait feedback keeps its tightest event budget", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.wait_for_horn.text.length < 326);
});
