import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("closing storm shutters confirms when beam tuning is already complete", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 947, [
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
    "wait_for_horn",
  ]).state;

  assert.equal(legalActions(world, tower).includes("close_storm_shutters"), true);

  const closed = step(world, tower, "close_storm_shutters");
  assert.equal(closed.ok, true, closed.error);
  assert.match(closed.event, /beam tuning is complete/i);
  assert.match(closed.event, /sheltered finish is ready/i);
  assert.doesNotMatch(closed.event, /remaining trim or alignment/i);
});
