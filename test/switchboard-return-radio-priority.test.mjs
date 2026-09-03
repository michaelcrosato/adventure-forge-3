import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("filled repair returns prioritize an already confirmed channel", async () => {
  const world = await loadWorld();
  const traces = [
    [
      "take_lantern",
      "secure_mooring",
      "enter_house",
      "read_log",
      "study_tide_chart",
      "signal_boat",
      "check_storm_radio",
      "take_oil",
      "climb_tower",
      "fill_lantern",
    ],
    [
      "take_lantern",
      "secure_mooring",
      "enter_house",
      "read_log",
      "study_tide_chart",
      "signal_boat",
      "wind_chronometer",
      "check_storm_radio",
      "take_oil",
      "climb_tower",
      "fill_lantern",
    ],
  ];

  for (const trace of traces) {
    const filled = replayActions(world, 901201, trace).state;
    const returned = step(world, filled, "return_keeper_after_fill");

    assert.equal(returned.ok, true, returned.error);
    assert.match(returned.event, /confirmed channel is already prepared/i);
    assert.doesNotMatch(returned.event, /chronometer|closes early/i);
  }
});
