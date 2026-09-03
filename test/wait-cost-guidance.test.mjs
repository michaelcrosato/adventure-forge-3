import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn wait makes its turn cost explicit", async () => {
  const world = await loadWorld();

  assert.match(world.actions.wait_for_horn.label, /one turn/i);
  assert.match(world.actions.wait_for_horn.text, /spend one turn/i);
  assert.match(world.actions.wait_for_horn.text, /remaining turn/i);
});
