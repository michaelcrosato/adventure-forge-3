import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern pickup points to the boat-signal follow-up", async () => {
  const world = await loadWorld();
  const text = world.actions.take_lantern.text;

  assert.match(text, /secure the mooring line before entering/i);
  assert.match(text, /signal the boat from the keeper's room/i);
});
