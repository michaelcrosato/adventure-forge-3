import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the secured jetty observation stops repeating the mooring action", async () => {
  const world = await loadWorld();
  const jetty = replayActions(world, 8401, ["take_lantern", "secure_mooring"]).state;
  const text = observation(world, jetty).text;

  assert.equal(legalActions(world, jetty).includes("secure_mooring"), false);
  assert.match(text, /the mooring is secure; enter when ready/i);
  assert.doesNotMatch(text, /secure the line before entering/i);
});
