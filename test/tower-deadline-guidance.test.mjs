import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern room tells players to light on the final turn", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.tower.text, /last turn: light now/i);
});
