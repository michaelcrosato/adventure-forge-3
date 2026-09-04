import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("completed-supply stair events use sentence boundaries", async () => {
  const world = await loadWorld();
  const prepPending = replayActions(world, 8201, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const prepReturn = step(world, prepPending, "return_keeper_from_workshop");

  assert.equal(prepReturn.ok, true, prepReturn.error);
  assert.match(prepReturn.event, /restored\. Finish any keeper-room prep, then use/i);

  const completePrep = replayActions(world, 8202, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "check_storm_radio",
    "take_oil",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const completeReturn = step(world, completePrep, "return_keeper_from_workshop");

  assert.equal(completeReturn.ok, true, completeReturn.error);
  assert.match(completeReturn.event, /restored\. Then use the repaired stair/i);
});
