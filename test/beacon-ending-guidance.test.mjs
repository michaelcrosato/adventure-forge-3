import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the shared beacon ending stays accurate for every rescue route", async () => {
  const world = await loadWorld();
  const text = world.endings.beacon.text;

  assert.match(text, /beacon burns through the rain/i);
  assert.match(text, /island has a keeper again/i);
  assert.doesNotMatch(text, /supply boat answers/i);
});
