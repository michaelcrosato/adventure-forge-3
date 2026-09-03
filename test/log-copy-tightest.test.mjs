import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("wall-log feedback keeps its tightened sequence budget", async () => {
  const world = await loadWorld();
  const text = world.actions.read_log.text;

  assert.ok(text.length < 130);
  assert.match(text, /Replace the fuse, fill the hand lantern, then touch its flame to the beacon/i);
  assert.match(text, /keeper's sequence can strengthen the rescue/i);
});
