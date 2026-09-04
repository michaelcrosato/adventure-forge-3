import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("confirmed-channel tower input drops the completed clue recap before beam tuning", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 9402, [
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
  ]).state;
  const input = modelTurnInput(world, observation(world, state));

  assert.match(input.text, /finish any trim or alignment before spending a turn to wait/i);
  assert.doesNotMatch(input.text, /log and tide chart are recorded/i);
  assert.doesNotMatch(input.text, /radio channel already confirmed/i);
  assert.match(input.text, /sheltered finish is unavailable after radio confirmation/i);
  assert.ok(input.facts.includes("Radio channel clear."));
  assert.ok(input.facts.includes("Tide chart: light the beacon before the next high tide."));
});
