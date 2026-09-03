import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the repaired workshop lists emergency recovery before the ladder", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 647, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const actions = legalActions(world, workshop);

  assert.ok(actions.indexOf("return_keeper_after_repair") < actions.indexOf("climb_service_ladder"));
});
