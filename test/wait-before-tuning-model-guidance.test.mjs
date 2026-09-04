import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("bounded tower copy explains that waiting before tuning is legal", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 150, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "read_log",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.equal(replayed.state.turn, 13);
  assert.match(replayed.observation.text, /finish any trim or alignment before spending a turn to wait/i);
  assert.match(input.text, /waiting now is legal, but finish tuning before lighting next turn/i);
});
