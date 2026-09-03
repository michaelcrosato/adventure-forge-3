import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the horn-wait label warns against spending the last turn", async () => {
  const world = await loadWorld();

  assert.match(world.actions.wait_for_horn.label, /never on the last turn/i);
});
