import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("mooring recovery remains available after the tide chart is studied", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 2933, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
  ]).state;

  assert.equal(legalActions(world, keeper).includes("return_for_mooring"), true);
  assert.match(world.actions.return_for_mooring.label, /recovery remains open afterward/i);

  const returned = step(world, keeper, "return_for_mooring");
  assert.equal(returned.ok, true, returned.error);
  assert.equal(returned.state.room, "jetty");
});
