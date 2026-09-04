import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("filled lantern model input drops the unneeded mooring oil step", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 900004, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "read_log",
  ]).state;
  const view = observation(world, keeper);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, keeper).includes("take_oil"), false);
  assert.match(view.text, /mooring is unsecured; take oil if needed, then return to secure it before studying the tide/i);
  assert.match(input.text, /mooring is unsecured; return to secure it before studying the tide/i);
  assert.doesNotMatch(input.text, /take oil if needed.*return to secure it before studying the tide/i);
});
