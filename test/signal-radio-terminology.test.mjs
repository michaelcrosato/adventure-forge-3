import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("post-signal feedback distinguishes the keeper radio from the tower relay", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 3641, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.match(signaled.event, /keeper-room radio/i);
  assert.match(signaled.event, /tower relay later/i);
});
