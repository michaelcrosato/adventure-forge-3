import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("tide-chart feedback keeps its tightened warning budget", async () => {
  const world = await loadWorld();
  const text = world.actions.study_tide_chart.text;

  assert.ok(text.length < 85);
  assert.match(text, /safe window for a stronger rescue.*next high tide/i);
});
