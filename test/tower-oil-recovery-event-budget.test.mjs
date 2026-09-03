import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("tower oil recovery feedback stays compact", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.return_keeper_from_tower.text.length < 140);
});
