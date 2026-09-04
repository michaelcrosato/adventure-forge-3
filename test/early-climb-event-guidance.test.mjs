import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("early climb event does not promise chronometer prep after filling", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 911003, [
    "enter_house",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "go_jetty",
    "take_lantern",
    "enter_house",
    "climb_tower",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(replayed.observation.event, /early chronometer timing closes after this fill/i);
  assert.doesNotMatch(replayed.observation.event, /wind the chronometer/i);
  assert.match(input.last, /early chronometer timing closes after this fill/i);
  assert.doesNotMatch(input.last, /wind the chronometer/i);
});
