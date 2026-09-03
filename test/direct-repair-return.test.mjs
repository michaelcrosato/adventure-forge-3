import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a repaired workshop can release a player who still lacks supplies", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 643, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;

  assert.equal(workshop.room, "workshop");
  assert.equal(workshop.flags.includes("workshop_return_used"), false);
  assert.equal(legalActions(world, workshop).includes("return_keeper_after_repair"), true);

  const returned = step(world, workshop, "return_keeper_after_repair");
  assert.equal(returned.ok, true, returned.error);
  assert.equal(returned.state.room, "keeper_room");
});
