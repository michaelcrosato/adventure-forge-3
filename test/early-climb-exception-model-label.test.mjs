import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("early climb label explains that lantern filling is its one tower exception", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 7403, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);
  const climb = input.a.find(([, label]) => /unpowered stair/i.test(label));

  assert.ok(climb);
  assert.match(view.actions.find(([id]) => id === "climb_tower")[1], /no tower work until the fuse is installed/i);
  assert.match(climb[1], /no tower work until the fuse is installed.*filling the lantern is the exception/i);
  assert.match(climb[1], /fill the lantern.*return to repair the switchboard/i);
});
