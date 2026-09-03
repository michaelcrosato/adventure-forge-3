import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("workshop entry stays conditional after current is restored", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 2501, [
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
  ]);

  assert.equal(replayed.state.flags.includes("fuse_installed"), true);
  assert.deepEqual(legalActions(world, replayed.state), ["return_keeper_after_repair", "climb_service_ladder"]);
  assert.match(replayed.observation.event, /if current is not restored/i);
  assert.doesNotMatch(replayed.observation.event, /dry fuse wait inside/i);
});
