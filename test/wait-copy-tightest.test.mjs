import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("horn-wait feedback keeps its tightened route budget", async () => {
  const world = await loadWorld();
  const text = world.actions.wait_for_horn.text;

  assert.ok(text.length < 305);
  assert.match(text, /horn-timed finish.*with the log.*marked-tide rescue.*fallback/i);
  assert.match(text, /finish any trim or alignment before lighting if needed/i);
  assert.match(text, /never wait on the last turn/i);
});
