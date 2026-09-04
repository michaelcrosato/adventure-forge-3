import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("bounded model events keep dynamic semicolon clauses in sentence case", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 2026, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(replayed.observation.event, /Current is already restored; Take oil if needed/i);
  assert.match(input.last, /Current is already restored; take oil if needed/i);
  assert.doesNotMatch(input.last, /; [A-Z]/);
});
