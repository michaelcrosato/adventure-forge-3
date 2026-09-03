import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("tower relay feedback stays compact for event-heavy turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.check_tower_radio.text.length < 230);
});
