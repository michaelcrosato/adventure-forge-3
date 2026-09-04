import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, replayActions, step } from "../src/engine.mjs";

test("dynamic route events capitalize generated follow-up instructions", async () => {
  const world = await loadWorld();
  const pickedUp = step(world, createState(world, 8101), "take_lantern");
  const entered = step(world, pickedUp.state, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /boat holds\. Read the wall log and take the oil;/);

  const keeper = replayActions(world, 8102, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "take_oil",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.match(signaled.event, /boat holds position\. Read the wall log and study the tide chart/);
});
