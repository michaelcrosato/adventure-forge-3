import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the bounded jetty input stops asking for a lantern that is already carried", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 7401, ["take_lantern"]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.deepEqual(view.actions.map(([id]) => id), ["secure_mooring", "enter_house", "leave_island"]);
  assert.match(view.text, /take the lantern if it remains/i);
  assert.match(input.text, /lantern is already carried/i);
  assert.doesNotMatch(input.text, /take the lantern if it remains/i);
});
