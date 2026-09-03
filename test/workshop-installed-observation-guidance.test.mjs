import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the installed workshop points ready players to the service ladder", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 8501, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const text = observation(world, workshop).text;

  assert.equal(legalActions(world, workshop).includes("climb_service_ladder"), true);
  assert.match(text, /fuse is installed.*supplies are ready.*climb the service ladder/i);
  assert.doesNotMatch(text, /install the fuse instead of backtracking/i);
});
