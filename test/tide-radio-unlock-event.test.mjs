import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("studying the tide chart names the newly available storm-radio action", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 418019, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
  ]).state;

  const chartRead = step(world, keeper, "study_tide_chart");
  assert.equal(chartRead.ok, true, chartRead.error);
  assert.match(chartRead.event, /storm radio is now available/i);
  assert.match(chartRead.event, /check it before taking oil \(costs one turn\)/i);
});
