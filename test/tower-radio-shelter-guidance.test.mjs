import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tower relay cues shutter preparation before radio confirmation", async () => {
  const world = await loadWorld();
  const text = world.actions.check_tower_radio.text;

  assert.match(text, /bar storm shutters before this check/i);
  assert.match(text, /sheltered finish/i);
});
