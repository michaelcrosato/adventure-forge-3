import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("wick-trim feedback stays compact for tuning turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.trim_wick.text.length < 110);
});
