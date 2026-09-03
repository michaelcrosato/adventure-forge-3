import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("boat-signal feedback stays compact and keeps the clue order", async () => {
  const world = await loadWorld();
  const text = world.actions.signal_boat.text;

  assert.ok(text.length < 120);
  assert.match(text, /supply boat holds position.*read the log and tide chart before checking the storm radio/i);
});
