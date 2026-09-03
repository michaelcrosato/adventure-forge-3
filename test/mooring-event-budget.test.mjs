import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("mooring feedback stays compact for event-heavy turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.secure_mooring.text.length < 205);
});
