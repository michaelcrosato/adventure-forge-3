import assert from "node:assert/strict";
import test from "node:test";
import {
  legalActions,
  loadWorld,
  modelTurnInput,
  observation,
  replayActions,
} from "../src/engine.mjs";

test("the pre-fill tower input does not advertise unavailable tuning actions", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 611020, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.deepEqual(legalActions(world, state), ["fill_lantern"]);
  assert.match(view.text, /aligned by hand if needed/i);
  assert.doesNotMatch(input.text, /aligned by hand if needed|charred wick can be trimmed/i);
});
