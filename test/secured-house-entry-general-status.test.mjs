import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("secured house entry labels the mooring warning as a general rule", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 517020, ["take_lantern", "secure_mooring"]).state;
  const entered = step(world, secured, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /general status rule.*if mooring unsecured.*once secure, boat holds/i);
});
