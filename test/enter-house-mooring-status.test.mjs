import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("house entry stays accurate after the mooring is secured", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 2907, ["take_lantern", "secure_mooring"]).state;
  const entered = step(world, secured, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.equal(entered.state.flags.includes("mooring_secured"), true);
  assert.match(entered.event, /if mooring unsecured.*boat may not hold/i);
  assert.match(entered.event, /once secure, boat holds/i);
  assert.doesNotMatch(entered.event, /Mooring unsecured:/i);
});
