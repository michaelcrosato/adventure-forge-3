import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a repaired filled tower can confirm the radio through its relay", async () => {
  const world = await loadWorld();
  const filled = replayActions(world, 487, [
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
  ]).state;

  assert.equal(filled.flags.includes("radio_checked"), false);
  assert.equal(legalActions(world, filled).includes("check_tower_radio"), true);

  const checked = step(world, filled, "check_tower_radio");
  assert.equal(checked.ok, true, checked.error);
  assert.equal(checked.state.flags.includes("radio_checked"), true);
  assert.equal(checked.state.score, filled.score + 1);
});
