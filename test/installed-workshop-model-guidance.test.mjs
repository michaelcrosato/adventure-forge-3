import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("installed workshop model input drops the spent fuse instruction", async () => {
  const world = await loadWorld();
  const installed = replayActions(world, 900002, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const view = observation(world, installed);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /if the fuse remains uninstalled/i);
  assert.doesNotMatch(input.text, /if the fuse remains uninstalled/i);
  assert.match(input.text, /fuse is installed.*supplies are ready.*climb the service ladder/i);
});
