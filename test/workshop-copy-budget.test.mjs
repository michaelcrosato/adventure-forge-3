import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("workshop-entry feedback stays compact and actionable", async () => {
  const world = await loadWorld();
  const text = world.actions.go_workshop.text;

  assert.ok(text.length < 145);
  assert.match(text, /current is not restored.*switchboard fuse.*restore tower power.*otherwise return to the keeper's room for missing supplies/i);
});
