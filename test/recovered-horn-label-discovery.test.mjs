import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

const recoveredRoute = [
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
  "go_workshop",
  "take_fuse",
  "install_fuse",
  "climb_service_ladder",
  "fill_lantern",
];

function modelWaitLabel(world, replayed) {
  const view = observation(world, replayed.state, replayed.observation.event);
  const waitIndex = view.actions.findIndex(([id]) => id === "wait_for_horn");
  return modelTurnInput(world, view).a[waitIndex]?.[1];
}

test("recovered confirmed-channel wait labels leave the payoff to discovery", async () => {
  const world = await loadWorld();
  const filled = replayActions(world, 27002, recoveredRoute);
  const tuned = replayActions(world, 27002, [...recoveredRoute, "trim_wick", "align_lens"]);

  assert.equal(modelWaitLabel(world, filled), "Wait for the horn; tune or light afterward");
  assert.equal(modelWaitLabel(world, tuned), "Wait for the horn; listen for the boat");
});
