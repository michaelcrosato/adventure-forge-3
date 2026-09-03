import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("keeper guidance makes post-fill radio checking time-dependent", async () => {
  const world = await loadWorld();
  assert.match(world.rooms.keeper_room.text, /after the lantern is filled, only with time/i);
});
