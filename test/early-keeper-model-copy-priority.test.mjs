import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("early keeper model copy prioritizes immediate setup cues", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 7405, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.match(
    input.text,
    /read the wall log and study the tide chart; signal the boat if you want the confirmed channel; take the oil before climbing; fill the lantern in the tower/i,
  );
  assert.doesNotMatch(input.text, /check the radio after the clues|after the lantern is filled, only with time|use the repaired stair once current is restored/i);
});

test("canonical keeper model copy narrows as setup advances", async () => {
  const world = await loadWorld();
  const prefix = ["take_lantern", "secure_mooring", "enter_house"];
  const cases = [
    {
      trace: [...prefix, "signal_boat"],
      text: /read the wall log and study the tide chart; boat signal already confirmed; take the oil before climbing/i,
    },
    {
      trace: [...prefix, "read_log"],
      text: /study the tide chart; signal the boat if you want the confirmed channel/i,
    },
    {
      trace: [...prefix, "read_log", "study_tide_chart", "signal_boat"],
      text: /check the radio for the confirmed channel; then take the oil before climbing/i,
    },
    {
      trace: [
        ...prefix,
        "read_log",
        "study_tide_chart",
        "signal_boat",
        "check_storm_radio",
      ],
      text: /take the oil; then use the workshop before climbing/i,
    },
    {
      trace: [
        ...prefix,
        "read_log",
        "study_tide_chart",
        "signal_boat",
        "check_storm_radio",
        "take_oil",
      ],
      text: /oil is ready; fill the lantern in the tower after the workshop repair.*climb the service ladder first/i,
    },
  ];

  for (const { trace, text } of cases) {
    const replayed = replayActions(world, 7406, trace);
    const input = modelTurnInput(world, replayed.observation);

    assert.match(input.text, text);
    assert.doesNotMatch(
      input.text,
      /after the lantern is filled, only with time|use the repaired stair once current is restored/i,
    );
  }
});

test("post-signal model feedback keeps the next clue local", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 7407, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(input.last, /boat holds\. study the tide chart to unlock the storm radio/i);
  assert.doesNotMatch(input.last, /tower relay|taking oil|costs one turn/i);
});
