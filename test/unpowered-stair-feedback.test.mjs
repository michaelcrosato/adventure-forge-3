import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the unrepaired tower climb explains the switchboard dependency", async () => {
  const world = await loadWorld();

  assert.match(world.actions.climb_tower.text, /unpowered stair/i);
  assert.match(world.actions.climb_tower.text, /switchboard still needs repair/i);
});
