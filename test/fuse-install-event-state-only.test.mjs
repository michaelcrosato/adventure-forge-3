import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("fuse installation feedback reports the repair without prescribing the climb", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 26001, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
  ]).state;
  const installed = step(world, workshop, "install_fuse");

  assert.equal(installed.ok, true, installed.error);
  assert.equal(installed.event, "Fuse installed; tower current restored.");
  assert.doesNotMatch(installed.event, /climb the service ladder/i);
});
