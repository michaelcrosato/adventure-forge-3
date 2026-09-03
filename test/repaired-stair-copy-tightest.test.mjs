import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("repaired-stair feedback keeps its tightened routing budget", async () => {
  const world = await loadWorld();
  const text = world.actions.climb_repaired_stairs.text;

  assert.ok(text.length < 110);
  assert.match(text, /fill the lantern if it still holds oil.*continue the beacon work above/i);
});
