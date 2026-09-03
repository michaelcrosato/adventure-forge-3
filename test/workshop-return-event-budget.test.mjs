import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("workshop return feedback stays compact for recovery turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.return_keeper_from_workshop.text.length < 205);
});
