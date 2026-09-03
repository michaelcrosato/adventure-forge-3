import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("the workshop copy stays conditional after the fuse is installed", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 1701, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
  ]).state;
  const view = observation(world, workshop);

  assert.equal(legalActions(world, workshop).includes("take_fuse"), false);
  assert.equal(legalActions(world, workshop).includes("climb_service_ladder"), true);
  assert.match(view.text, /if the fuse remains uninstalled/i);
  assert.doesNotMatch(view.text, /one dry ceramic fuse rests in a drawer/i);
});
