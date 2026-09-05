import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("eventful tuned horn choice leaves its payoff to discovery", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 958001, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
    "check_tower_radio",
  ]);
  const index = replayed.observation.actions.findIndex(([id]) => id === "wait_for_horn");
  const input = modelTurnInput(world, replayed.observation);

  assert.ok(index >= 0);
  assert.equal(input.a[index][1], "Wait for the horn; listen for the boat's answer");
  assert.doesNotMatch(input.a[index][1], /bonus|finish|beam tuning|costs one turn/i);
});
