import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback advertises only reachable radio guidance", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 3511, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
  ]).state;
  const earlySignal = step(world, secured, "signal_boat");

  assert.match(earlySignal.event, /read the log and tide chart before checking the storm radio/i);

  const clued = replayActions(world, 3512, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
  ]).state;
  const readySignal = step(world, clued, "signal_boat");

  assert.match(readySignal.event, /check the storm radio before taking oil/i);
});
