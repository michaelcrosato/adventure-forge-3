import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("ready confirmed-channel input prioritizes the powered workshop route", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 9307, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));
  const workshop = input.a.find(([, label]) => /workshop/i.test(label));

  assert.equal(legalActions(world, state).includes("go_workshop"), true);
  assert.equal(legalActions(world, state).includes("climb_tower"), true);
  assert.ok(workshop);
  assert.match(workshop[1], /install the fuse before climbing/i);
  assert.match(workshop[1], /avoid an unpowered return/i);
});
