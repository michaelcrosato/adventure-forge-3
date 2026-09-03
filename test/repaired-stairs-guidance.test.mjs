import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the repaired stair gives a state-accurate tower cue", async () => {
  const world = await loadWorld();

  assert.match(world.actions.climb_repaired_stairs.text, /continue the beacon work above/i);
  assert.doesNotMatch(world.actions.climb_repaired_stairs.text, /lantern ready/i);
});
