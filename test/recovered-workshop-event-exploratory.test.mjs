import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("recovered workshop arrival keeps the repair cue local", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 35000, [
    "take_lantern",
    "enter_house",
    "read_log",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const entered = step(world, keeper, "go_workshop");
  const input = modelTurnInput(world, observation(world, entered.state, entered.event));

  assert.equal(entered.ok, true, entered.error);
  assert.equal(entered.event, "Workshop entered; fuse remains to be installed.");
  assert.doesNotMatch(entered.event, /take and install|service ladder/i);
  assert.equal(input.last, "Workshop entered; fuse remains to be installed.");
});
