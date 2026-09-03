import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("keeper copy stays conditional after its optional checks are spent", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 2301, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const view = observation(world, keeper);

  assert.deepEqual(legalActions(world, keeper), ["go_workshop", "climb_tower", "leave_island"]);
  assert.match(view.text, /use what remains/i);
  assert.match(view.text, /signal the boat first if needed/i);
  assert.match(view.text, /check radio if needed/i);
});
