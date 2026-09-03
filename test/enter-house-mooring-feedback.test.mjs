import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("entering the house repeats the unsecured-mooring consequence", async () => {
  const world = await loadWorld();

  assert.match(world.actions.enter_house.text, /mooring unsecured/i);
  assert.match(world.actions.enter_house.text, /boat may not hold/i);
});
