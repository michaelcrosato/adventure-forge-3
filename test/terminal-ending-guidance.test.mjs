import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("a final-turn beacon ending does not render stale deadline guidance", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 1, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
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
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "trim_wick",
    "align_lens",
    "light_radio_rescue_beacon",
  ]);
  const view = replayed.observation;
  const input = modelTurnInput(world, view);

  assert.equal(replayed.state.turn, world.maxTurns - 1);
  assert.equal(replayed.state.ending, "beacon");
  assert.equal(view.text, view.end[2]);
  assert.doesNotMatch(view.text, /no rescue remains|leave if possible/i);
  assert.doesNotMatch(input.text, /no rescue remains|leave if possible/i);
  assert.equal("deadline" in input, false);
});
