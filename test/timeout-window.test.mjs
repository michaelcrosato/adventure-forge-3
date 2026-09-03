import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("waiting at the deadline reaches the existing timeout ending", async () => {
  const world = await loadWorld();
  const late = replayActions(world, 367, [
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
    "go_jetty",
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "trim_wick",
    "align_lens",
  ]).state;

  assert.equal(late.turn, 23);
  assert.equal(legalActions(world, late).includes("wait_for_horn"), true);
  const timeout = step(world, late, "wait_for_horn");
  assert.equal(timeout.ok, true, timeout.error);
  assert.equal(timeout.state.ending, "timeout");
});
