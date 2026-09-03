import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("service-ladder recovery events name only the missing supply", async () => {
  const world = await loadWorld();

  const lanternOnly = replayActions(world, 15001, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const lanternClimb = step(world, lanternOnly, "climb_service_ladder");

  assert.equal(legalActions(world, lanternClimb.state).includes("return_keeper_from_tower"), true);
  assert.match(lanternClimb.event, /with the lantern, but oil is missing.*fetch oil/i);
  assert.doesNotMatch(lanternClimb.event, /carry the lantern and oil/i);

  const oilOnly = replayActions(world, 15002, [
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const oilClimb = step(world, oilOnly, "climb_service_ladder");

  assert.equal(legalActions(world, oilClimb.state).includes("return_keeper_for_lantern"), true);
  assert.match(oilClimb.event, /with oil, but the lantern is missing.*fetch the lantern/i);
  assert.doesNotMatch(oilClimb.event, /carry the lantern and oil/i);
});
