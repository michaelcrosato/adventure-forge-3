import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the repaired workshop explains when a keeper-room return is useful", async () => {
  const world = await loadWorld();
  const text = world.rooms.workshop.text;

  assert.match(text, /after installation.*climb the service ladder/i);
  assert.match(text, /return only for missing supplies or unfinished keeper-room prep/i);
});
