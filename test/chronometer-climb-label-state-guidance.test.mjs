import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the early climb label reflects completed or closed chronometer prep", async () => {
  const world = await loadWorld();
  const cases = [
    {
      name: "already wound",
      trace: [
        "take_lantern",
        "secure_mooring",
        "enter_house",
        "read_log",
        "signal_boat",
        "study_tide_chart",
        "wind_chronometer",
        "take_oil",
      ],
      expected: /chronometer is already wound/i,
    },
    {
      name: "timing closed",
      trace: [
        "take_lantern",
        "secure_mooring",
        "enter_house",
        "read_log",
        "study_tide_chart",
        "signal_boat",
        "take_oil",
        "climb_tower",
        "return_keeper_after_fill",
      ],
      expected: /early chronometer timing is closed/i,
    },
  ];

  for (const scenario of cases) {
    const state = replayActions(world, 901103, scenario.trace).state;
    const input = modelTurnInput(world, observation(world, state));
    const climb = input.a.find(([, label]) => /unpowered stair/i.test(label));

    assert.ok(climb, `${scenario.name}: climb label is visible`);
    assert.match(climb[1], scenario.expected, scenario.name);
    assert.match(climb[1], /fill the lantern.*repair the switchboard/i, scenario.name);
    assert.doesNotMatch(climb[1], /wind the tower chronometer/i, scenario.name);
  }
});
