import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation bounds model-visible room and action text", async () => {
  const world = await loadWorld();
  world.actions.read_log.text = "x".repeat(561);

  assert.throws(
    () => validateWorld(world),
    /Action read_log text must be at most 560 characters/,
  );

  world.actions.read_log.text = "A short clue.";
  world.rooms.tower.text = "x".repeat(561);

  assert.throws(
    () => validateWorld(world),
    /Room tower text must be at most 560 characters/,
  );
});
