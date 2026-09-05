import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("informed chronometer workshop turns stop narrating the whole repair route", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 588, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
  ]).state;
  const entered = step(world, keeper, "go_workshop");
  const taken = step(world, entered.state, "take_fuse");
  const input = modelTurnInput(world, observation(world, taken.state, taken.event));

  assert.equal(entered.ok, true, entered.error);
  assert.equal(entered.event, "Workshop entered; fuse remains to be installed.");
  assert.equal(taken.ok, true, taken.error);
  assert.equal(taken.event, "You take the dry fuse from the drawer.");
  assert.equal(input.last, "Fuse ready; install when ready.");
  assert.doesNotMatch(`${entered.event} ${taken.event} ${input.last}`, /then climb the service ladder/i);
});
