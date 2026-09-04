import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("filled lantern model input drops the spent oil reminder", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 900003, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;
  const view = observation(world, keeper);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, keeper).includes("take_oil"), false);
  assert.match(view.text, /if unsecured: read the log, take oil/i);
  assert.match(input.text, /if unsecured: read the log, then return to secure the mooring/i);
  assert.doesNotMatch(input.text, /if unsecured: read the log, take oil/i);
});
