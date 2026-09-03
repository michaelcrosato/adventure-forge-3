import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("switchboard-return feedback stays compact and sequenced", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_after_fill.text;

  assert.ok(text.length < 130);
  assert.match(text, /pause the lantern work.*switchboard is repaired below.*return to the workshop.*install the fuse.*climb again/i);
});
