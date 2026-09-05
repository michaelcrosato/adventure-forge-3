import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("house entry does not repeat the just-reported mooring status", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 623020, ["take_lantern", "secure_mooring"]).state;
  const entered = step(world, secured, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  const immediate = observation(world, entered.state, entered.event);
  assert.doesNotMatch(immediate.text, /signal the boat first if needed/i);
  assert.doesNotMatch(immediate.text, /Mooring is secure; the boat will hold\.$/i);
  assert.match(immediate.text, /check radio if needed before taking the oil/i);

  const later = observation(world, entered.state);
  assert.match(later.text, /Mooring is secure; the boat will hold/i);
});
