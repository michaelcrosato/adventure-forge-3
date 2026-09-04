import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("fuse pickup model feedback keeps the installation cue compact", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 260, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(replayed.observation.event, /install it in the switchboard before leaving/i);
  assert.equal(input.last, "Fuse ready; install it, then climb the service ladder.");
  assert.match(input.a[0][1], /install the fuse in the switchboard/i);
});
