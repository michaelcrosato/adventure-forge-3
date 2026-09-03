import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the last-turn deadline admits when no rescue finish remains", async () => {
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

  const input = modelTurnInput(world, observation(world, late));

  assert.equal(late.turn, world.maxTurns - 1);
  assert.match(input.deadline, /no rescue remains.*leave if possible/i);
  assert.doesNotMatch(input.deadline, /light now/i);
});
