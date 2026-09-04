import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("chronometer fill feedback names the horn wait behind the strongest finish", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 268, [
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
  ]);
  const input = modelTurnInput(world, observation(world, replayed.state, replayed.observation.event));

  assert.match(input.last, /strongest chronometer-timed rescue after the horn wait/i);
  assert.match(input.last, /light directly for the basic finish/i);
  assert.doesNotMatch(input.last, /trim the wick or align the lens for a stronger rescue; do both for the strongest/i);
});
