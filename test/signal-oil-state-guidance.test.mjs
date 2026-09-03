import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signaling with oil carried still names unread clues", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7202, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "take_oil",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.match(signaled.event, /boat holds position.*read the wall log and study the tide chart before climbing/i);
});

test("signaling with oil after both clues stays concise", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7203, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.equal(signaled.event, "Ring the bell; supply boat holds position.");
});
