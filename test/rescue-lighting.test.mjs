import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("the log and tide mark unlock the rescue-protocol finish", async () => {
  const world = await loadWorld();
  const prepared = replayActions(world, 229, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;

  assert.equal(legalActions(world, prepared).includes("light_rescue_beacon"), true);
  const ending = step(world, prepared, "light_rescue_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, prepared.score + 9);
});
