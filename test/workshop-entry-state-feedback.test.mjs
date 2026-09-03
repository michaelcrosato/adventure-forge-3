import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("unrepaired workshop entry names the mandatory repair sequence", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 3631, ["enter_house"]).state;
  const entered = step(world, keeper, "go_workshop");

  assert.equal(entered.ok, true, entered.error);
  assert.equal(entered.state.flags.includes("fuse_installed"), false);
  assert.equal(legalActions(world, entered.state).includes("take_fuse"), true);
  assert.match(
    entered.event,
    /current is not restored.*take and install the switchboard fuse.*use the service ladder/i,
  );
  assert.doesNotMatch(entered.event, /otherwise return to the keeper's room/i);
});
