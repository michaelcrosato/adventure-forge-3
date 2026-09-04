import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("installed workshop model input drops the spent fuse event", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 19001, [
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(replayed.observation.event, /if current is not restored.*install the switchboard fuse/i);
  assert.match(input.last, /current is already restored.*missing supplies.*service ladder/i);
  assert.doesNotMatch(input.last, /if current is not restored|install the switchboard fuse/i);
});
