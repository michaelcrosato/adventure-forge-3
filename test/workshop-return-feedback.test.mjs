import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the workshop backtrack reports the tower work still ahead", async () => {
  const world = await loadWorld();

  assert.match(world.actions.return_keeper_from_workshop.text, /tower work remains ahead/i);
  assert.match(world.actions.return_keeper_from_workshop.text, /workshop stays behind/i);
});
