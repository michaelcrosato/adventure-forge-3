import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("secured house model event drops the obsolete mooring rule", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 517020, ["take_lantern", "secure_mooring"]).state;
  const entered = step(world, secured, "enter_house");
  const input = modelTurnInput(world, observation(world, entered.state, entered.event));

  assert.equal(entered.ok, true, entered.error);
  assert.match(input.last, /mooring is secure; the boat will hold/i);
  assert.match(input.last, /optional next step: signal the boat from the keeper's room/i);
  assert.doesNotMatch(input.last, /for reference|general status rule|if mooring unsecured/i);
});
