import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("mooring recovery feedback reports only the completed move and next action", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 433017, [
    "take_lantern",
    "enter_house",
    "read_log",
  ]).state;

  const returned = step(world, keeper, "return_for_mooring");
  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /return to the jetty.*secure the supply boat's mooring next/i);
  assert.doesNotMatch(returned.event, /then re-enter the keeper's house/i);
});
