import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("secured-mooring feedback keeps a tighter event budget", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.secure_mooring.text.length < 190);
});
