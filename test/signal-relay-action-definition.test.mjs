import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("signal feedback defines the later tower relay action", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 541020, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.match(
    signaled.event,
    /tower relay later if you skip the check \(to confirm the channel\), after filling the lantern in the tower: in the lantern room, choose Check the tower relay for a clear channel/i,
  );
});
