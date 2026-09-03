import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback marks the keeper-room radio check as optional", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 3651, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.match(signaled.event, /keeper-room radio check optional/i);
  assert.match(signaled.event, /tower relay later/i);
});
