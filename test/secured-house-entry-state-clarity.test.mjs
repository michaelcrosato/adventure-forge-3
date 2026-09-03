import test from "node:test";
import assert from "node:assert/strict";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("secured house entry labels the unsecured warning as a general rule", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 483020, ["take_lantern", "secure_mooring"]).state;
  const entered = step(world, secured, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /no return is needed/i);
  assert.match(entered.event, /status rule.*if mooring unsecured/i);
});
