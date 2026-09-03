import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the missing-oil return points back to the tower route", async () => {
  const world = await loadWorld();

  assert.match(world.actions.return_keeper_from_tower.text, /missing oil/i);
  assert.match(world.actions.return_keeper_from_tower.text, /returning to the tower/i);
});
