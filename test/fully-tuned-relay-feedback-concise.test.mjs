import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("a fully tuned relay keeps its confirmation feedback concise", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 565020, [
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
  ]).state;
  const view = observation(world, tower);
  const relay = view.actions.find(([id]) => id === "check_tower_radio");
  const model = modelTurnInput(world, view);
  const checked = step(world, tower, "check_tower_radio");

  assert.ok(relay);
  assert.equal(relay[1], "Check the tower relay; beam tuning is complete (costs one turn)");
  assert.equal(
    checked.event,
    "Channel is clear; this enables the strongest rescue outcome. Beam tuning is complete; use the confirmed-channel rescue beacon.",
  );
  assert.doesNotMatch(checked.event, /before last turn|never on last turn|finish beam tuning if needed/i);
  assert.equal(model.a.find(([index]) => index === view.actions.indexOf(relay))[1], relay[1]);
});
