import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("model mooring label names the tide chart instead of tide study", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 379019, ["take_lantern", "enter_house", "read_log"]).state;
  const view = observation(world, keeper);
  const input = modelTurnInput(world, view);
  const rawAction = view.actions.find(([id]) => id === "return_for_mooring");
  const modelAction = input.a.find(([index]) => view.actions[index][0] === "return_for_mooring");

  assert.ok(rawAction);
  assert.ok(modelAction);
  assert.match(rawAction[1], /before tide study/i);
  assert.match(modelAction[1], /before studying the tide chart/i);
  assert.doesNotMatch(modelAction[1], /tide study/i);
});
