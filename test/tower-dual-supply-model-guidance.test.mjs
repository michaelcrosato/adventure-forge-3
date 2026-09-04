import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("dual-supply tower model labels name distinct first pickups", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 900008, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const view = observation(world, tower);
  const input = modelTurnInput(world, view);

  assert.deepEqual(
    legalActions(world, tower).filter((id) => id.includes("return_keeper")),
    ["return_keeper_from_tower", "return_keeper_for_lantern"],
  );
  assert.match(view.actions[0][1], /missing oil or lantern/i);
  assert.match(view.actions[1][1], /missing lantern or oil/i);
  assert.match(input.a[0][1], /fetch oil first.*lantern is also missing/i);
  assert.match(input.a[1][1], /fetch the lantern first.*oil is also missing/i);
  assert.notEqual(input.a[0][1], input.a[1][1]);
});
