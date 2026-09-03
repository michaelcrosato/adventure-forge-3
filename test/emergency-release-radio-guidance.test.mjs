import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the emergency release preserves a confirmed channel", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 904001, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const returned = step(world, workshop, "return_keeper_after_repair");

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /confirmed channel is already prepared/i);
  assert.doesNotMatch(returned.event, /moored boat can still be rescued/i);
});
