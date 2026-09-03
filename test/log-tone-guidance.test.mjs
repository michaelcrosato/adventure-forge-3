import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the wall log keeps its repair sequence readable in sentence case", async () => {
  const world = await loadWorld();
  const text = world.actions.read_log.text;

  assert.match(text, /Replace the fuse, fill the hand lantern, then touch its flame to the beacon/i);
  assert.doesNotMatch(text, /REPLACE FUSE, FILL HAND LANTERN/);
});
