import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the timeout ending explains what was missed", async () => {
  const world = await loadWorld();

  assert.match(world.endings.timeout.text, /before you light the beacon/i);
});
