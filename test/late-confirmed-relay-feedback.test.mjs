import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("late confirmed-channel relay feedback leaves the finale choice open", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 701003, [
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

  const checked = step(world, tower, "check_tower_radio");
  const input = modelTurnInput(world, observation(world, checked.state, checked.event));

  assert.equal(tower.turn, world.maxTurns - 7);
  assert.equal(checked.ok, true, checked.error);
  assert.equal(checked.event, "Channel is clear; the confirmed-channel finish is ready.");
  assert.equal(input.last, checked.event);
  assert.doesNotMatch(
    `${checked.event} ${input.last}`,
    /strongest rescue|use confirmed-channel rescue beacon|beam tuning is complete/i,
  );
});
