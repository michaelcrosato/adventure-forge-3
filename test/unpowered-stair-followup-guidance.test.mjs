import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the unpowered stair points to filling and fuse repair", async () => {
  const world = await loadWorld();
  const text = world.actions.climb_tower.text;

  assert.match(text, /switchboard still needs repair below/i);
  assert.match(text, /fill the lantern if you have oil.*return to install the fuse/i);
});
