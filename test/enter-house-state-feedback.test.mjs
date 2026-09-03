import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("entering the house omits the lantern recovery warning after pickup", async () => {
  const world = await loadWorld();
  const pickedUp = step(world, createState(world, 3311), "take_lantern");
  const entered = step(world, pickedUp.state, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /mooring unsecured.*boat may not hold/i);
  assert.doesNotMatch(entered.event, /lantern is still outside/i);
});
