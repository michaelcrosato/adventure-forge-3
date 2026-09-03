import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("workshop-room feedback keeps its tightened recurring budget", async () => {
  const world = await loadWorld();
  const text = world.rooms.workshop.text;

  assert.ok(text.length < 350);
  assert.match(text, /if the fuse remains uninstalled.*service ladder opens/i);
  assert.match(text, /already carry both lantern and oil.*install the fuse instead of backtracking/i);
  assert.match(text, /return only for missing supplies or unfinished keeper-room prep/i);
});
