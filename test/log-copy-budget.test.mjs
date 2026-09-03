import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("wall-log feedback stays direct and compact", async () => {
  const world = await loadWorld();
  const text = world.actions.read_log.text;

  assert.ok(text.length < 140);
  assert.match(text, /^Replace the fuse, fill the hand lantern, then touch its flame to the beacon\./i);
});
