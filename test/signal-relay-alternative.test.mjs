import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback makes the later tower relay conditional", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 419018, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;

  const signaled = step(world, keeper, "signal_boat");
  assert.equal(signaled.ok, true, signaled.error);
  assert.match(signaled.event, /if you want the keeper-room confirmation, then check it before taking oil/i);
  assert.match(signaled.event, /tower relay later if you skip the check \(to confirm the channel\)/i);
});
