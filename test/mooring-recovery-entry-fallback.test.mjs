import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("skipping the recovered mooring points to the available basic route", async () => {
  const world = await loadWorld();
  const returned = replayActions(world, 770041, [
    "take_lantern",
    "enter_house",
    "read_log",
    "return_for_mooring",
  ]).state;

  const entered = step(world, returned, "enter_house");
  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /recovery return was used without securing it/i);
  assert.match(entered.event, /continue with the basic beacon route/i);
  assert.doesNotMatch(entered.event, /return to the jetty/i);
  assert.equal(legalActions(world, entered.state).includes("return_for_mooring"), false);
});
