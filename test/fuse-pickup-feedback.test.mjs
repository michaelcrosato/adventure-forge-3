import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the fuse pickup points to installation before leaving", async () => {
  const world = await loadWorld();
  const text = world.actions.take_fuse.text;

  assert.match(text, /dry fuse/i);
  assert.match(text, /install it in the switchboard before leaving/i);
});
