import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the switchboard return explains why the lantern work pauses", async () => {
  const world = await loadWorld();

  assert.match(world.actions.return_keeper_after_fill.text, /pause the lantern work/i);
  assert.match(world.actions.return_keeper_after_fill.text, /switchboard is repaired below/i);
});
