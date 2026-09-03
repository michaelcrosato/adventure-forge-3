import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("supply return labels name only the item still missing", async () => {
  const world = await loadWorld();

  const lanternMissing = replayActions(world, 917001, [
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const lanternView = observation(world, lanternMissing);
  const lanternInput = modelTurnInput(world, lanternView);
  const lanternLabel = lanternInput.a.find(([, label]) => /missing lantern/i.test(label));

  assert.equal(legalActions(world, lanternMissing).includes("return_keeper_for_lantern"), true);
  assert.ok(lanternLabel);
  assert.match(lanternLabel[1], /oil is already carried/i);
  assert.doesNotMatch(lanternLabel[1], /missing lantern or oil/i);

  const oilMissing = replayActions(world, 917002, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const oilView = observation(world, oilMissing);
  const oilInput = modelTurnInput(world, oilView);
  const oilLabel = oilInput.a.find(([, label]) => /missing oil/i.test(label));

  assert.equal(legalActions(world, oilMissing).includes("return_keeper_from_tower"), true);
  assert.ok(oilLabel);
  assert.match(oilLabel[1], /lantern is already carried/i);
  assert.doesNotMatch(oilLabel[1], /missing oil or lantern/i);
});
