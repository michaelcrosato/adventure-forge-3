import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("recovered mooring feedback reports the restored boat without replaying route tiers", async () => {
  const world = await loadWorld();
  const jetty = replayActions(world, 26002, [
    "enter_house",
    "read_log",
    "take_oil",
    "go_jetty",
    "take_lantern",
    "enter_house",
    "return_for_mooring",
  ]).state;
  const secured = step(world, jetty, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.equal(secured.event, "Mooring secured after the recovery return; the boat is safe.");
  assert.doesNotMatch(secured.event, /basic rescue|stronger channel route|keeper-room menu/i);
});
