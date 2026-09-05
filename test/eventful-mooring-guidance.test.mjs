import assert from "node:assert/strict";
import test from "node:test";
import {
  createState,
  loadWorld,
  modelTurnInput,
  observation,
  replayActions,
  step,
} from "../src/engine.mjs";

test("eventful mooring views avoid repeating the same recovery instructions", async () => {
  const world = await loadWorld();

  const lantern = step(world, createState(world, 977001), "take_lantern");
  const entered = step(world, lantern.state, "enter_house");
  const enteredInput = modelTurnInput(world, observation(world, entered.state, entered.event));

  assert.equal(entered.ok, true, entered.error);
  assert.match(enteredInput.last, /return to the jetty to secure it before lighting/i);
  assert.doesNotMatch(enteredInput.text, /return to secure the mooring before climbing/i);
  assert.match(enteredInput.text, /fill the lantern in the tower/i);

  const returned = replayActions(world, 977002, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "take_oil",
    "return_for_mooring",
  ]);
  const returnedInput = modelTurnInput(
    world,
    observation(world, returned.state, returned.observation.event),
  );

  assert.equal(returnedInput.text, "The mooring is at hand before re-entering the keeper's house.");
  assert.match(returnedInput.a[0][1], /secure the supply boat's mooring/i);
});
