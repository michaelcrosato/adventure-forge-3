import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("re-entry before securing the recovered mooring keeps its warning accurate", async () => {
  const world = await loadWorld();
  const returned = replayActions(world, 770031, [
    "take_lantern",
    "enter_house",
    "read_log",
    "return_for_mooring",
  ]).state;

  assert.equal(returned.flags.includes("mooring_return_used"), true);
  assert.equal(returned.flags.includes("mooring_secured"), false);

  const entered = step(world, returned, "enter_house");
  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /mooring unsecured.*boat may not hold/i);
  assert.doesNotMatch(entered.event, /mooring is secure/i);
  assert.doesNotMatch(entered.event, /signal the boat for a confirmed channel/i);
});
