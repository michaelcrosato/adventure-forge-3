import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn wait distinguishes the logged marked-tide route", async () => {
  const world = await loadWorld();
  const text = world.actions.wait_for_horn.text;

  assert.match(text, /can unlock the horn-timed finish when the tide mark is recorded without the wall log/i);
  assert.match(text, /with the log.*marked-tide rescue.*fallback/i);
});
