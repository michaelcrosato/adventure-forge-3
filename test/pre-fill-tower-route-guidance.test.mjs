import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("pre-fill tower input does not advertise an unreachable relay", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 24105, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));

  assert.deepEqual(legalActions(world, state), ["fill_lantern"]);
  assert.match(input.text, /basic beacon route remains available after filling/i);
  assert.doesNotMatch(input.text, /tower relay can confirm/i);
});
