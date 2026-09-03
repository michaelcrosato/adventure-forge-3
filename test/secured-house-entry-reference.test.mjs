import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("secured house entry frames the general status rule as reference", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 547020, ["take_lantern", "secure_mooring"]).state;
  const entered = step(world, secured, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /For reference, general status rule: if mooring unsecured, boat may not hold; once secure, boat holds/i);
});
