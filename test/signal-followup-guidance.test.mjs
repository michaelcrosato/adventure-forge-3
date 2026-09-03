import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the boat signal points players toward the radio prerequisites", async () => {
  const world = await loadWorld();
  const text = world.actions.signal_boat.text;

  assert.match(text, /holds position/i);
  assert.match(text, /read the log and tide chart before checking the storm radio/i);
});
