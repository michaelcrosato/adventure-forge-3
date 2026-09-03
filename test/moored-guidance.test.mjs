import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the mooring feedback explains the unsignaled finish", async () => {
  const world = await loadWorld();

  assert.match(world.actions.secure_mooring.text, /signal it from the keeper's room/i);
  assert.match(world.actions.secure_mooring.text, /keep the mooring secured and light for the boat directly/i);
});
