import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("lantern recovery feedback keeps its split route compact", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_for_lantern.text;

  assert.ok(text.length < 137, `lantern recovery feedback is ${text.length} characters`);
  assert.match(text, /return to the jetty/i);
  assert.match(text, /collect the missing lantern/i);
  assert.match(text, /oil too if needed before climbing again/i);
  assert.match(text, /moored boat can still be rescued/i);
});
