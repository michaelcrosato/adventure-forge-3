import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, legalActions, observation, replayActions } from "../src/engine.mjs";

test("dual-supply tower recovery labels name both possible supplies", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 53, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
    "climb_service_ladder",
  ]).state;

  assert.deepEqual(tower.inventory, []);
  assert.deepEqual(
    legalActions(world, tower).filter((id) => id.includes("return_keeper")),
    ["return_keeper_from_tower", "return_keeper_for_lantern"],
  );

  const labels = Object.fromEntries(
    observation(world, tower).actions.filter(([id]) => id.includes("return_keeper")),
  );
  assert.match(labels.return_keeper_from_tower, /missing oil or lantern/i);
  assert.match(labels.return_keeper_for_lantern, /missing lantern or oil/i);
});
