import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the final no-rescue tower copy gives one concise exit cue", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 1, [
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
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.turn, world.maxTurns - 1);
  assert.deepEqual(view.actions, [["leave_island", world.actions.leave_island.label]]);
  assert.equal((view.text.match(/no rescue remains/gi) ?? []).length, 2);
  assert.equal((input.text.match(/no rescue remains/gi) ?? []).length, 1);
  assert.match(view.text, /Last turn: no rescue remains/i);
  assert.doesNotMatch(input.text, /Last turn: no rescue remains/i);
  assert.match(input.text, /No beacon finish remains/i);
  assert.match(input.deadline, /last turn: no rescue remains; leave if possible/i);
});
