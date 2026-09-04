import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("fully tuned tower model input drops spent beam-tuning cues", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 900006, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;
  const view = observation(world, tower);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /aligned by hand if needed.*charred wick can be trimmed/i);
  assert.doesNotMatch(input.text, /aligned by hand if needed|charred wick can be trimmed/i);
  assert.match(input.text, /beam tuning is complete; light the beacon when ready/i);
});
