import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("keeper guidance drops the unsecured recovery paragraph after mooring is secure", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 8805, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
  ]).state;
  const text = observation(world, keeper).text;

  assert.match(text, /mooring is secure; the boat will hold/i);
  assert.doesNotMatch(text, /if unsecured: read the log.*return to secure the mooring/i);
});
