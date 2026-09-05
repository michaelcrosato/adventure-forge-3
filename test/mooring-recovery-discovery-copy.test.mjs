import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("ready mooring recovery leaves the jetty action to discovery", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 764022, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
  ]).state;
  const choice = observation(world, keeper).actions.find(([id]) => id === "return_for_mooring");

  assert.ok(choice);
  assert.equal(choice[1], "Return to the jetty");
  assert.doesNotMatch(choice[1], /tide study|recovery remains/i);

  const returned = step(world, keeper, "return_for_mooring");
  assert.equal(returned.ok, true, returned.error);
  assert.equal(returned.event, "You return to the jetty; the mooring line is at hand.");
  assert.ok(observation(world, returned.state, returned.event).actions.some(([id]) => id === "secure_mooring"));
});
