import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the keeper explains the radio recovery timing after filling", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.keeper_room.text, /after the lantern is filled/i);
});
