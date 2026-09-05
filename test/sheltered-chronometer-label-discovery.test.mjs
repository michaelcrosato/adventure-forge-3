import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("the sheltered chronometer finish label keeps its rescue variant unrevealed", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 100011, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
    "close_storm_shutters",
  ]).state;

  const view = observation(world, state);
  const visible = view.actions.find(([id]) => id === "light_sheltered_chronometer_beacon");
  const input = modelTurnInput(world, view);
  const modelVisible = input.a.find(([index]) => view.actions[index][0] === "light_sheltered_chronometer_beacon");

  assert.deepEqual(visible, ["light_sheltered_chronometer_beacon", "Light the beacon"]);
  assert.deepEqual(modelVisible, [modelVisible[0], "Light the beacon"]);
  assert.doesNotMatch(`${visible[1]} ${modelVisible[1]}`, /sheltered|chronometer|rescue/i);

  const ending = step(world, state, "light_sheltered_chronometer_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.match(ending.event, /chronometer chimes on the marked tide/i);
});
