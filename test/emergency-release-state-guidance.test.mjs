import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the emergency release makes oil pickup conditional", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 433, [
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;

  assert.deepEqual(workshop.inventory, ["oil"]);
  assert.match(world.actions.return_keeper_after_repair.text, /take missing oil if needed/i);
});
