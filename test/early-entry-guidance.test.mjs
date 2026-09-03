import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("early house entry points back to the lantern on the jetty", async () => {
  const world = await loadWorld();
  const text = world.actions.enter_house.text;

  assert.match(text, /lantern is still outside/i);
  assert.match(text, /return to the jetty for it/i);
});
