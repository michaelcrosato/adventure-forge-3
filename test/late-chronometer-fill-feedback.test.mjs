import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("late chronometer filling focuses on the beacon state", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 581, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const filled = step(world, tower, "fill_lantern");
  const input = modelTurnInput(world, observation(world, filled.state, filled.event));

  assert.equal(tower.turn, world.maxTurns - 10);
  assert.equal(filled.ok, true, filled.error);
  assert.equal(
    filled.event,
    "Hand lantern filled; beacon remains dark. Finish available beam work before lighting.",
  );
  assert.equal(input.text, "Lantern filled; beacon remains dark. Finish available beam work before lighting.");
  assert.equal(input.last, "Lantern filled; beacon remains dark; finish available beam work before lighting.");
});
