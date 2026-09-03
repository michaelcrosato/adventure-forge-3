import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("a horn-waited final tower turn does not promise later lighting", async () => {
  const world = await loadWorld();
  const late = replayActions(world, 9401, [
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
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
    "wait_for_horn",
    "close_storm_shutters",
  ]).state;
  const text = observation(world, late).text;

  assert.equal(late.turn, world.maxTurns - 1);
  assert.match(text, /horn timing is recorded; no rescue remains; leave if possible/i);
  assert.doesNotMatch(text, /finish the remaining beam tuning before lighting/i);
});
