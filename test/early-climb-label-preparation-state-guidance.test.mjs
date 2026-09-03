import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the early climb label avoids unavailable chronometer prep while keeper work is unfinished", async () => {
  const world = await loadWorld();
  const cases = [
    ["no keeper preparation", ["take_lantern", "enter_house", "take_oil"]],
    [
      "partial keeper preparation",
      ["take_lantern", "enter_house", "read_log", "take_oil"],
    ],
  ];

  for (const [name, trace] of cases) {
    const state = replayActions(world, 911003, trace).state;
    const input = modelTurnInput(world, observation(world, state));
    const climb = input.a.find(([, label]) => /unpowered stair/i.test(label));

    assert.ok(climb, `${name}: climb label is visible`);
    assert.match(climb[1], /fill the lantern.*finish keeper preparation.*repairing the switchboard/i, name);
    assert.doesNotMatch(climb[1], /chronometer|wind/i, name);
  }
});
