import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback explains when the storm radio becomes available", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 3621, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;

  const signaled = step(world, keeper, "signal_boat");
  assert.equal(signaled.ok, true, signaled.error);
  assert.equal(legalActions(world, signaled.state).includes("study_tide_chart"), true);
  assert.equal(legalActions(world, signaled.state).includes("check_storm_radio"), false);
  assert.match(signaled.event, /study the tide chart now to unlock the storm radio/i);
  assert.match(signaled.event, /then check it before taking oil/i);

  const chartRead = step(world, signaled.state, "study_tide_chart");
  assert.equal(chartRead.ok, true, chartRead.error);
  assert.equal(legalActions(world, chartRead.state).includes("check_storm_radio"), true);
});
