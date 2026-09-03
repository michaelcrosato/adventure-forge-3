import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the workshop backtrack feedback stays accurate before or after repair", async () => {
  const world = await loadWorld();

  const text = world.actions.return_keeper_from_workshop.text;
  assert.match(text, /if the fuse is already installed/i);
  assert.match(text, /otherwise return to the workshop to take and install it/i);
});
