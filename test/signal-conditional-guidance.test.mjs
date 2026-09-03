import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("signaling the boat makes the log reminder conditional", async () => {
  const world = await loadWorld();

  assert.match(
    world.actions.signal_boat.text,
    /if needed, read the log and tide chart before checking the storm radio/i,
  );
});
