import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("recovery re-entry reports the secure mooring and available signal", async () => {
  const world = await loadWorld();
  const jetty = replayActions(world, 434018, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
  ]).state;

  const entered = step(world, jetty, "enter_house");
  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /mooring is secure.*boat will hold/i);
  assert.match(entered.event, /signal the boat for a confirmed channel/i);
  assert.doesNotMatch(entered.event, /mooring unsecured/i);
});
