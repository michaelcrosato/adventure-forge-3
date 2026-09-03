import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the service ladder omits the recovery warning when supplies are ready", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 3011, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]);

  assert.equal(replayed.state.room, "tower");
  assert.match(replayed.observation.event, /current restored.*climb the service ladder to the tower/i);
  assert.doesNotMatch(replayed.observation.event, /return below if supplies are missing/i);
});
