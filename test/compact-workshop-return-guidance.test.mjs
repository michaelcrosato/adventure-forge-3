import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the workshop backtrack keeps its state guidance compact", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_from_workshop.text;

  assert.ok(text.length < 200);
  assert.match(text, /tower work remains ahead.*workshop stays behind/i);
  assert.match(text, /fuse is already installed.*service ladder/i);
});
