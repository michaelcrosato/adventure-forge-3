import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the tower relay omits sheltered-shutter advice when that route is unavailable", async () => {
  const world = await loadWorld();
  const filled = replayActions(world, 3961, [
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

  const checked = step(world, filled, "check_tower_radio");

  assert.equal(checked.ok, true, checked.error);
  assert.match(checked.event, /channel is clear.*confirmed-channel rescue beacon/i);
  assert.doesNotMatch(checked.event, /storm shutters|sheltered finish/i);
});
