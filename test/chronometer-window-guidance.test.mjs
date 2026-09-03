import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the unpowered stair warns before its chronometer window closes", async () => {
  const world = await loadWorld();
  const text = world.actions.climb_tower.text;

  assert.match(text, /chronometer-timed rescue.*before this early fill/i);
  assert.match(text, /repair return closes that option/i);
});
