import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("filling the lantern names the beacon as the next thing to light", async () => {
  const world = await loadWorld();

  assert.match(world.actions.fill_lantern.text, /before lighting the beacon/i);
});
