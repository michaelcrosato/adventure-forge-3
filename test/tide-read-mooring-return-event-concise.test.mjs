import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("post-tide mooring return confirms the location and leaves securing to the menu", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 84001, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
  ]).state;
  const returned = step(world, keeper, "return_for_mooring");
  const view = observation(world, returned.state, returned.event);
  const secure = view.actions.find(([id]) => id === "secure_mooring");

  assert.equal(returned.ok, true, returned.error);
  assert.equal(returned.event, "You return to the jetty; the mooring line is at hand.");
  assert.doesNotMatch(returned.event, /secure the supply boat's mooring next|stronger boat route/i);
  assert.ok(secure);
  assert.equal(secure[1], "Secure the supply boat's mooring");
});
