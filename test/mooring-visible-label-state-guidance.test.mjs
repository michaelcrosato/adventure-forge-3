import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the mooring menu label switches to lighting after tide study", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 6601, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
  ]).state;
  const action = observation(world, keeper).actions.find(([id]) => id === "return_for_mooring");

  assert.ok(action);
  assert.match(action[1], /secure the mooring before lighting/i);
  assert.doesNotMatch(action[1], /before tide study/i);
});
