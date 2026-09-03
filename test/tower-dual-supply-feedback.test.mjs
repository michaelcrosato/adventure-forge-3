import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tower oil return covers the dual-supply recovery case", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_from_tower.text;

  assert.match(text, /lantern is missing too/i);
  assert.match(text, /collect both/i);
});
