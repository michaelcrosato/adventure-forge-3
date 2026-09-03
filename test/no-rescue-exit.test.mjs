import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("a final turn without a rescue finish offers a graceful exit", async () => {
  const world = await loadWorld();
  const late = replayActions(world, 901, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "trim_wick",
    "align_lens",
  ]).state;

  assert.equal(late.turn, world.maxTurns - 1);
  assert.equal(legalActions(world, late).includes("leave_island"), true);
  assert.deepEqual(observation(world, late).actions, [
    ["leave_island", world.actions.leave_island.label],
  ]);

  const departed = step(world, late, "leave_island");
  assert.equal(departed.ok, true, departed.error);
  assert.equal(departed.state.ending, "left");
});
