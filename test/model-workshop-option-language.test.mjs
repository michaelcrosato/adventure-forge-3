import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("bounded workshop guidance frames the fuse sequence as an option", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 7404, ["enter_house"]).state;
  const entered = step(world, keeper, "go_workshop");
  const view = observation(world, entered.state, entered.event);
  const input = modelTurnInput(world, view);

  assert.match(entered.event, /take and install the switchboard fuse/i);
  assert.match(input.text, /one efficient option: take the fuse this turn; install it next; then climb the service ladder; this order is optional/i);
  assert.match(input.last, /one efficient option: take the fuse this turn; install it next; then climb the service ladder; this order is optional/i);
  assert.match(input.last, /return to the keeper's room is available before taking it/i);

  const taken = step(world, entered.state, "take_fuse");
  const takenInput = modelTurnInput(world, observation(world, taken.state, taken.event));

  assert.match(takenInput.text, /install the fuse when ready; then climb the service ladder/i);
  assert.doesNotMatch(takenInput.text, /return to the keeper's room is available before taking it/i);
  assert.doesNotMatch(takenInput.text, /return only for missing supplies|emergency release returns/i);
});
