import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("alignment feedback stays compact for tuning turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.align_lens.text.length < 115);
});
