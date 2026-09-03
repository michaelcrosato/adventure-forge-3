import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the workshop backtrack gives the repaired stair an action verb", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_from_workshop.text;

  assert.match(text, /take oil if needed; use repaired stair/i);
  assert.ok(text.length < 200);
});
