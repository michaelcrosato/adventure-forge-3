import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback separates immediate and optional follow-ups", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 620020, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.deepEqual(signaled.event.split("\n").slice(0, 4), [
    "Study the tide chart now to unlock the storm radio: make the storm radio available.",
    "If you want the keeper-room confirmation, then check it before taking oil (costs one turn).",
    "The check choice appears after the tide chart.",
    "Keeper-room radio check optional.",
  ]);
  assert.match(signaled.event, /tower relay later if you skip the check.*choose Check the tower relay for a clear channel/i);
});
