import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the jetty copy stays conditional after setup is complete", async () => {
  const world = await loadWorld();
  const jetty = replayActions(world, 2002, ["take_lantern", "secure_mooring"]).state;

  assert.deepEqual(legalActions(world, jetty), ["enter_house", "leave_island"]);
  assert.match(observation(world, jetty).text, /take the lantern if it remains/i);
  assert.doesNotMatch(observation(world, jetty).text, /take the lantern, then secure/i);
});
