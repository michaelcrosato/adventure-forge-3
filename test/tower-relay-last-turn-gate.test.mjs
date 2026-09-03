import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the tower relay is unavailable on the last turn", async () => {
  const world = await loadWorld();
  const route = [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
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
    "wait_for_horn",
    "close_storm_shutters",
  ];
  const beforeLast = replayActions(world, 2901, route.slice(0, -1)).state;
  const lastTurn = replayActions(world, 2901, route).state;

  assert.equal(beforeLast.turn, world.maxTurns - 2);
  assert.equal(legalActions(world, beforeLast).includes("check_tower_radio"), true);
  assert.equal(lastTurn.turn, world.maxTurns - 1);
  assert.equal(legalActions(world, lastTurn).includes("check_tower_radio"), false);
});
