import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("early chronometer guidance names what to wind", async () => {
  const world = await loadWorld();

  assert.match(
    world.actions.climb_tower.text,
    /chronometer-timed rescue: wind it before this early fill/i,
  );
});
