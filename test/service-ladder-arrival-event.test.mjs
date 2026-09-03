import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the service-ladder event confirms arrival in the lantern room", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 4101, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;

  const climbed = step(world, workshop, "climb_service_ladder");

  assert.equal(climbed.ok, true, climbed.error);
  assert.match(climbed.event, /current restored.*climb the service ladder to the tower.*reach the lantern room/i);
});
