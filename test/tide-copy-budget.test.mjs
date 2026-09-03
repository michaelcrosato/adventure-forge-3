import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("tide-chart feedback stays compact while preserving its warning", async () => {
  const world = await loadWorld();
  const text = world.actions.study_tide_chart.text;

  assert.ok(text.length < 125);
  assert.match(text, /safe window for a stronger rescue.*next high tide/i);
});
