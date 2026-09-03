import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("house-entry feedback keeps its tightened routing budget", async () => {
  const world = await loadWorld();
  const text = world.actions.enter_house.text;

  assert.ok(text.length < 140);
  assert.match(text, /mooring unsecured.*boat may not hold/i);
  assert.match(text, /lantern is still outside.*return to the jetty for it/i);
});
