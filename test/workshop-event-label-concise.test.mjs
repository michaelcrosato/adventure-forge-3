import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("post-oil workshop labels leave the repair decision to the player", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 9307, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
  ]);
  const workshop = replayed.observation.actions.find(([id]) => id === "go_workshop");

  assert.ok(workshop);
  assert.equal(workshop[1], "Enter the workshop");
  assert.doesNotMatch(workshop[1], /install the fuse|avoid an unpowered return/i);
});
