import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("early tower model labels avoid premature last-turn urgency", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 132, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "read_log",
    "take_oil",
    "study_tide_chart",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);
  const trim = input.a.find(([index]) => view.actions[index][0] === "trim_wick");
  const align = input.a.find(([index]) => view.actions[index][0] === "align_lens");

  assert.equal(state.turn, 12);
  assert.ok(trim);
  assert.ok(align);
  assert.match(trim[1], /trim the wick for a cleaner beam/i);
  assert.match(align[1], /align the lens for a truer beam/i);
  assert.doesNotMatch(`${trim[1]} ${align[1]}`, /last turn/i);
  assert.match(view.actions.find(([id]) => id === "trim_wick")[1], /before last turn/i);
});
