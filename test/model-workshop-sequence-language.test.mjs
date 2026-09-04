import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("workshop model guidance separates the fuse actions by turn", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 3631, ["enter_house"]).state;
  const entered = step(world, keeper, "go_workshop");
  const input = modelTurnInput(world, observation(world, entered.state, entered.event));

  assert.equal(entered.ok, true, entered.error);
  assert.match(input.text, /take the fuse this turn; install it next; then climb the service ladder/i);
  assert.match(input.last, /take the fuse this turn; install it next; then climb the service ladder/i);
  assert.doesNotMatch(input.last, /take and install the switchboard fuse/i);
});
