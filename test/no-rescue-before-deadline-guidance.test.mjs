import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("unrecoverable late preparation shows an honest exit cue", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 1, [
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
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
  ]);
  const state = replayed.state;

  assert.equal(state.room, "tower");
  assert.equal(state.turn, 18);

  const view = replayed.observation;
  const input = modelTurnInput(world, view);

  assert.match(view.event, /No beacon finish remains before the deadline/i);
  assert.match(view.text, /No beacon finish remains before the deadline/i);
  assert.deepEqual(view.actions, [["fill_lantern", world.actions.fill_lantern.label]]);
  assert.match(input.text, /No beacon finish remains before the deadline/i);
  assert.match(input.last, /No beacon finish remains before the deadline/i);
  assert.doesNotMatch(input.text, /Several lighting choices|finish the remaining preparation/i);

  const keeperReplayed = replayActions(world, 1, [
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
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]);
  assert.match(keeperReplayed.observation.event, /No beacon finish remains before the deadline/i);
  assert.deepEqual(keeperReplayed.observation.actions, [["leave_island", world.actions.leave_island.label]]);
});
