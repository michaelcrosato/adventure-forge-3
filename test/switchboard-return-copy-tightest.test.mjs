import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("switchboard-return feedback keeps its tightened sequence budget", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_after_fill.text;

  assert.ok(text.length < 120);
  assert.match(text, /pause the lantern work.*switchboard is repaired below.*return to the workshop.*install the fuse.*climb again/i);
});
