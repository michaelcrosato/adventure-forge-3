import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("the late chronometer horn label leaves its timing tradeoff to discovery", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 701002, [
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
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;
  const view = observation(world, tower);
  const index = view.actions.findIndex(([id]) => id === "wait_for_horn");
  const input = modelTurnInput(world, view);
  const modelWait = input.a.find(([actionIndex]) => actionIndex === index);

  assert.equal(tower.turn, world.maxTurns - 7);
  assert.deepEqual(view.actions[index], ["wait_for_horn", "Wait for the horn"]);
  assert.deepEqual(modelWait, [index, "Wait for the horn"]);
  assert.doesNotMatch(`${view.actions[index][1]} ${modelWait[1]}`, /bonus|costs one turn|preparation|light next turn/i);

  const waited = step(world, tower, "wait_for_horn");
  assert.equal(waited.ok, true, waited.error);
  assert.equal(waited.event, "Horn timing recorded; beam tuning is complete.");
});
