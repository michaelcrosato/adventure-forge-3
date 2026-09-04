import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("secured house entry skips the settled mooring preamble", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 100010, ["take_lantern", "secure_mooring"]).state;
  const entered = step(world, secured, "enter_house");
  const input = modelTurnInput(world, observation(world, entered.state, entered.event));

  assert.equal(entered.ok, true, entered.error);
  assert.doesNotMatch(entered.event, /^Door opens/i);
  assert.match(entered.event, /boat will hold.*no return is needed/i);
  assert.match(entered.event, /next step \(optional\): signal the boat from the keeper's room/i);
  assert.match(input.last, /mooring is secure; the boat will hold/i);
});
