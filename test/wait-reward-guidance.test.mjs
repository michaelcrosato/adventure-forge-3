import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn wait advertises its timing bonus before it is chosen", async () => {
  const world = await loadWorld();
  const action = world.actions.wait_for_horn;

  assert.match(action.label, /timing bonus/i);
  assert.match(action.text, /earns a small rescue bonus/i);
});
