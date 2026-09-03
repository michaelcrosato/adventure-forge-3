import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the chronometer label exposes its optional turn cost", async () => {
  const world = await loadWorld();
  const label = world.actions.wind_chronometer.label;

  assert.match(label, /costs one turn/i);
  assert.match(label, /optional precision prep/i);
});
