import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("penultimate horn wait warns to tune before spending the last setup turn", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 1, [
    "enter_house",
    "read_log",
    "study_tide_chart",
    "go_jetty",
    "take_lantern",
    "enter_house",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
    "climb_service_ladder",
    "return_keeper_from_tower",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
  ]).state;

  assert.equal(state.room, "tower");
  assert.equal(state.turn, world.maxTurns - 2);
  assert.equal(legalActions(world, state).includes("wait_for_horn"), true);
  assert.equal(
    legalActions(world, state).some((id) =>
      world.actions[id].effects.some((effect) => effect.end === "beacon"),
    ),
    false,
  );

  const view = observation(world, state);
  const input = modelTurnInput(world, view);
  const waitLabel = view.actions.find(([id]) => id === "wait_for_horn");
  const waitIndex = view.actions.findIndex(([id]) => id === "wait_for_horn");
  const modelWaitLabel = input.a[waitIndex];

  assert.match(waitLabel[1], /finish beam tuning before waiting/i);
  assert.match(waitLabel[1], /too little to tune and light/i);
  assert.deepEqual(modelWaitLabel, [waitIndex, waitLabel[1]]);
  assert.doesNotMatch(waitLabel[1], /light next turn/i);

  const waited = step(world, state, "wait_for_horn");
  assert.match(waited.event, /waiting now leaves no time to tune and light/i);
});
