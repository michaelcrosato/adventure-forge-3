import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("confirmed-channel tower copy keeps post-fill choices focused", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 7421, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.equal(
    input.text,
    "Finish any trim or alignment before spending a turn to wait; waiting now is legal, but finish tuning before lighting next turn. Sheltered finish is unavailable after radio confirmation; use the confirmed-channel finish.",
  );
  assert.doesNotMatch(input.text, /several lighting choices|marked-tide rescue/i);
});
