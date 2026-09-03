import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, step } from "../src/engine.mjs";

test("the tide chart gives an optional time-pressure clue once", async () => {
  const world = await loadWorld();
  let state = createState(world, 7);

  state = step(world, state, "enter_house").state;
  assert.ok(legalActions(world, state).includes("study_tide_chart"));

  const result = step(world, state, "study_tide_chart");
  assert.equal(result.ok, true, result.error);
  assert.equal(result.state.score, 1);
  assert.deepEqual(result.state.journal, [
    "Tide chart: light the beacon before the next high tide.",
  ]);
  assert.equal(legalActions(world, result.state).includes("study_tide_chart"), false);
});
