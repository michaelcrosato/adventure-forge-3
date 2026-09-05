import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("the late shutter label leaves its shelter payoff to the result", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 701004, [
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
    "wait_for_horn",
  ]).state;
  const view = observation(world, tower);
  const index = view.actions.findIndex(([id]) => id === "close_storm_shutters");
  const modelShutter = modelTurnInput(world, view).a.find(([actionIndex]) => actionIndex === index);

  assert.equal(tower.turn, world.maxTurns - 6);
  assert.deepEqual(view.actions[index], ["close_storm_shutters", "Close the storm shutters"]);
  assert.deepEqual(modelShutter, [index, "Close the storm shutters"]);
  assert.doesNotMatch(`${view.actions[index][1]} ${modelShutter[1]}`, /sheltered finish|beam tuning is complete|costs one turn/i);

  const closed = step(world, tower, "close_storm_shutters");
  assert.equal(closed.ok, true, closed.error);
  assert.match(closed.event, /sheltered finish is ready/i);
});
