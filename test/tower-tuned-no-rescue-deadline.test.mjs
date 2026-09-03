import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("a tuned final tower turn does not promise an unavailable rescue", async () => {
  const world = await loadWorld();
  const late = replayActions(world, 9101, [
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
  const text = observation(world, late).text;
  const finishes = legalActions(world, late).filter((id) =>
    world.actions[id].effects.some((effect) => effect.end === "beacon"),
  );

  assert.equal(late.turn, world.maxTurns - 1);
  assert.equal(finishes.length, 0);
  assert.match(text, /beam tuning is complete; no rescue remains; leave if possible/i);
  assert.doesNotMatch(text, /beam tuning is complete; light now/i);
});
