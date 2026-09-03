import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("wait event stays compact enough for bounded turn input", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.wait_for_horn.text.length < 340);
});
