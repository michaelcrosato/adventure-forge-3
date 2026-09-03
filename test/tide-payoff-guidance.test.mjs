import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tide chart explains its stronger-rescue payoff", async () => {
  const world = await loadWorld();

  assert.match(world.actions.study_tide_chart.text, /safe window for a stronger rescue/i);
});
