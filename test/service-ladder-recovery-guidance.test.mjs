import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the service ladder names the recovery route when supplies are missing", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 3001, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]);

  assert.deepEqual(legalActions(world, replayed.state), [
    "return_keeper_from_tower",
    "return_keeper_for_lantern",
  ]);
  assert.match(replayed.observation.event, /return below if supplies are missing/i);
});
