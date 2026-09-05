import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("the wall log stays focused after the mooring is secured", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 100021, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
  ]).state;
  const logged = step(world, keeper, "read_log");

  assert.equal(logged.ok, true, logged.error);
  assert.equal(
    logged.event,
    "The wall log confirms the remaining work: replace the fuse, fill the hand lantern, then light the beacon. Trim the wick and align the lens for a stronger beam; the confirmed channel chooses the strongest rescue route.",
  );
  assert.ok(logged.event.length < 260);
  assert.doesNotMatch(logged.event, /route choice|chronometer timing|future|before checking the storm radio/i);

  const input = modelTurnInput(world, observation(world, logged.state, logged.event));
  assert.match(input.last, /repair and fill are required/i);
  assert.match(input.last, /confirmed channel or chronometer timing selects the strongest rescue route/i);
});
