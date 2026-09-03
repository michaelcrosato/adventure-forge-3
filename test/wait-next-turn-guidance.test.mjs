import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("horn-wait feedback makes the next-turn lighting sequence explicit", async () => {
  const world = await loadWorld();
  const text = world.actions.wait_for_horn.text;

  assert.match(text, /never wait on the last turn.*light next turn/i);
});
